import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, ActivityIndicator, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getJourneyPlans, getCustomers } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['PENDING', 'VISITED', 'MISSED', 'ZERO SALES', 'UNPLANNED'];

export default function JourneyPlanScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plans, customers] = await Promise.all([
        getJourneyPlans(),
        getCustomers()
      ]);

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      const myPlan = plans.find((p: any) => {
        if (p.primaryEmployee !== user?.primaryEmployeeName || p.status !== 'Active') return false;
        const fromStr = new Date(p.validFrom).toISOString().split('T')[0];
        const toStr = new Date(p.validTo).toISOString().split('T')[0];
        return todayStr >= fromStr && todayStr <= toStr;
      });

      if (myPlan) {
        setCurrentPlan(myPlan);
        const customerIds = myPlan.customerIds || [];
        const filteredCustomers = customers.filter((c: any) => customerIds.includes(c.id));
        setAllCustomers(filteredCustomers);
      } else {
        setCurrentPlan(null);
        setAllCustomers([]);
      }
    } catch (error) {
      console.log(error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchData();
      }
    }, [user])
  );

  const filteredData = useMemo(() => {
    if (!currentPlan) return [];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const validFromStr = new Date(currentPlan.validFrom).toISOString().split('T')[0];
    const validToStr = new Date(currentPlan.validTo).toISOString().split('T')[0];

    const isStartingToday = validFromStr === todayStr;
    const isExpired = todayStr > validToStr;

    return allCustomers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.customerCode && customer.customerCode.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (isStartingToday) {
        // On the first day of the plan, only show in PENDING if not yet visited
        if (activeTab === 'PENDING') {
          return !customer.visitCompleted;
        } else if (activeTab === 'VISITED') {
          // ✅ Show in VISITED if visitCompleted is true (regardless of salesAmount)
          return customer.visitCompleted === true;
        } else {
          return false;
        }
      }

      // Normal behavior for other days of the plan
      switch (activeTab) {
        case 'PENDING':
          // ✅ Only show if visit is NOT completed and plan is not expired
          return !customer.visitCompleted && !isExpired;
        case 'VISITED':
          // ✅ Show ALL visited customers (with or without sales)
          return customer.visitCompleted === true;
        case 'MISSED':
          return !customer.visitCompleted && isExpired;
        case 'ZERO SALES':
          // Only show customers who completed visit but had zero sales
          return customer.visitCompleted === true && customer.salesAmount === 0;
        case 'UNPLANNED':
          return false;
        default:
          return true;
      }
    });
  }, [allCustomers, activeTab, searchQuery, currentPlan]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/customer/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.zoneText}>{item.zone || 'A Zone'}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Customer Code</Text>
          <Text style={styles.detailSeparator}>:</Text>
          <Text style={styles.detailValue}>{item.customerCode || 'WBD00022793'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Contact No.</Text>
          <Text style={styles.detailSeparator}>:</Text>
          <Text style={styles.detailValue}>{item.contactNo || '8017518929'}</Text>
        </View>
      </View>
      <View style={styles.cardFooter} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0052CC" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search and Map View */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#637381" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Customer Name/ Customer Co."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.mapButton} onPress={() => Alert.alert('Map View', 'Map view feature coming soon!')}>
          <Ionicons name="location-outline" size={20} color="#637381" />
          <Text style={styles.mapButtonText}>Map View</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchData}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No customers found in this section</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6F8',
  },
  tabsScroll: {
    paddingHorizontal: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0052CC',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#919EAB',
  },
  activeTabText: {
    color: '#0052CC',
  },
  searchRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6F8',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#212B36',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#F4F6F8',
    paddingLeft: 16,
    height: 32,
  },
  mapButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#212B36',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    backgroundColor: '#F4F6F8',
    minHeight: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 24,
  },
  customerName: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1C252E',
    marginBottom: 4,
  },
  zoneText: {
    fontSize: 14,
    color: '#919EAB',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#637381',
  },
  detailSeparator: {
    width: 20,
    fontSize: 14,
    color: '#637381',
  },
  detailValue: {
    fontSize: 14,
    color: '#0052CC',
    fontWeight: '600',
  },
  cardFooter: {
    height: 6,
    backgroundColor: '#FFAB00',
    marginTop: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#637381',
  }
});