// front/Kaptar/app/(tabs)/register.jsx
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth(); // Puxa o token do administrador logado

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Preencha todos os campos!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Envia o token JWT do Admin para o Node autorizar o cadastro
          'Authorization': `Bearer ${user?.token}` 
        },
        // Opcional: Forçamos a string do cargo como funcionário/operador para o backend
        body: JSON.stringify({ name, email, password, role: 'OPERATOR' }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar usuário');
      }

      Alert.alert('Sucesso!', 'Funcionário cadastrado com sucesso!');
      
      // Limpa o formulário
      setName('');
      setEmail('');
      setPassword('');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Funcionário</Text>
      <Text style={styles.subtitle}>Painel exclusivo de gerenciamento do Administrador</Text>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha do Funcionário"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar Funcionário</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#aaa', textAlign: 'center', marginBottom: 25 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ff4444', marginBottom: 10, textAlign: 'center', fontWeight: 'bold' }
});
