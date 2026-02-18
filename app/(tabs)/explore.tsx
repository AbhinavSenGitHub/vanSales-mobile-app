import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user.username || 'User'}</Text>
        <Text style={styles.role}>{user.role || 'Employee'}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="person-outline" size={24} color="#637381" />
          <Text style={styles.itemText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#C4CDD5" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Ionicons name="notifications-outline" size={24} color="#637381" />
          <Text style={styles.itemText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#C4CDD5" />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { marginTop: 24 }]}>
        <TouchableOpacity style={[styles.item, styles.logoutItem]} onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color="#FF4842" />
          <Text style={[styles.itemText, styles.logoutText]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00AB55',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#00AB55",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212B36',
  },
  role: {
    fontSize: 16,
    color: '#637381',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#919EAB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6F8',
  },
  itemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#212B36',
    fontWeight: '500',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF4842',
  }

});
