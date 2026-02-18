import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCustomers, updateCustomerVisit } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CustomerDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const customers = await getCustomers();
            const found = customers.find((c: any) => c.id.toString() === id);
            setCustomer(found);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleCompleteVisit = async (isSale: boolean) => {
        try {
            setLoading(true);
            const amount = isSale ? 500 : 0;
            // ✅ Always pass visitCompleted: true so the customer moves to VISITED tab
            await updateCustomerVisit(id as string, { visited: true, salesAmount: amount, visitCompleted: true });
            Alert.alert('Success', isSale ? 'Order placed and visit completed!' : 'Visit completed');
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to complete visit');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0052CC" /></View>;
    if (!customer) return <View style={styles.center}><Text>Customer not found</Text></View>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.mainCard}>
                <View style={styles.headerRow}>
                    <Text style={styles.customerName}>{customer.name}</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.plannedBadge}>
                            <Text style={styles.plannedText}>Planned</Text>
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <Ionicons name="document-text-outline" size={20} color="#637381" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoList}>
                    <InfoRow label="Customer Code" value={customer.customerCode} />
                    <InfoRow label="Stockist Name" value={customer.stockistName} valueColor="#0052CC" />
                    <InfoRow label="Sector" value={customer.zone || 'A Zone'} valueColor="#0052CC" />
                    <InfoRow label="Town Name" value={customer.townName} valueColor="#0052CC" />
                    <InfoRow label="Dealer Category" value={customer.dealerCategory} valueColor="#0052CC" />
                    <InfoRow label="Shop Category" value={customer.shopCategory} valueColor="#0052CC" />
                    <InfoRow label="Visit Frequency" value={customer.visitFrequency} valueColor="#0052CC" />
                    <InfoRow label="Customer Contact" value={customer.contactNo} valueColor="#0052CC" />
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <View style={styles.statLine} />
                    <Text style={styles.statLabel}>Last Order</Text>
                    <Text style={styles.statDate}>{customer.lastOrder === 'N/A' ? 'N/A' : 'Today'}</Text>
                    <Text style={styles.statValue}>INR {customer.lastOrder || 'N/A'}</Text>
                </View>
                <View style={[styles.statCard, { flex: 1.2 }]}>
                    <Text style={styles.statLabel}>Average Order</Text>
                    <View style={{ height: 20 }} />
                    <Text style={[styles.statValue, { fontSize: 24 }]}>INR {customer.avgOrder || '0.00'}</Text>
                </View>
            </View>

            <View style={styles.actionSection}>
                <TouchableOpacity
                    style={styles.primaryAction}
                    onPress={() => Alert.alert('Success', 'Checked in successfully!')}
                >
                    <Text style={styles.primaryActionText}>Check In</Text>
                </TouchableOpacity>

                <View style={styles.secondaryActions}>
                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: '#E8F5E9' }]}
                        onPress={() => handleCompleteVisit(true)}
                    >
                        <Ionicons name="cart-outline" size={24} color="#2E7D32" />
                        <Text style={[styles.secondaryButtonText, { color: '#2E7D32' }]}>Take Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: '#FFF3E0' }]}
                        onPress={() => Alert.alert('Notes', 'Notes added successfully')}
                    >
                        <Ionicons name="document-text-outline" size={24} color="#E65100" />
                        <Text style={[styles.secondaryButtonText, { color: '#E65100' }]}>Add Notes</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.completeAction}
                    onPress={() => handleCompleteVisit(false)}
                >
                    <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                    <Text style={styles.completeActionText}>Complete Visit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function InfoRow({ label, value, valueColor = '#212B36' }: { label: string, value: string, valueColor?: string }) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={[styles.infoValue, { color: valueColor }]}>{value || 'N/A'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    customerName: {
        fontSize: 20,
        fontWeight: '500',
        color: '#1C252E',
        flex: 1,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    plannedBadge: {
        backgroundColor: '#0052CC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginRight: 8,
    },
    plannedText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    editButton: {
        padding: 4,
    },
    infoList: {
        marginTop: 0,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        width: 120,
        fontSize: 13,
        color: '#637381',
    },
    infoSeparator: {
        width: 20,
        fontSize: 13,
        color: '#637381',
    },
    infoValue: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        position: 'relative',
        overflow: 'hidden',
    },
    statLine: {
        position: 'absolute',
        top: 16,
        left: 0,
        width: 3,
        height: 40,
        backgroundColor: '#0052CC',
    },
    statLabel: {
        fontSize: 12,
        color: '#919EAB',
        marginBottom: 4,
    },
    statDate: {
        fontSize: 10,
        color: '#0052CC',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0052CC',
    },
    actionSection: {
        marginTop: 10,
        marginBottom: 40,
    },
    primaryAction: {
        backgroundColor: '#0052CC',
        height: 54,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    primaryActionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    secondaryButton: {
        flex: 1,
        height: 54,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    completeAction: {
        backgroundColor: '#FF4842',
        height: 54,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    completeActionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    }
});