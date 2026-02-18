import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, isLoading } = useAuth();

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            alert('Please enter both username and password');
            return;
        }
        signIn(username, password);
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.logoBox}>
                    <Text style={styles.logoText}>VS</Text>
                </View>
                <Text style={styles.appName}>Van Sales App</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Employee Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Employee Name"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Log In'}</Text>
                </TouchableOpacity>

                <Text style={styles.hint}>
                    Hint: Use 'vansales_test01' / 'password123'
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoBox: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: '#00AB55',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212B36',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#919EAB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#637381',
        marginBottom: 12,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 24,
        fontSize: 16,
        color: '#212B36',
    },
    button: {
        height: 48,
        backgroundColor: '#00AB55',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    hint: {
        marginTop: 16,
        fontSize: 12,
        color: '#919EAB',
        textAlign: 'center',
    }
});
