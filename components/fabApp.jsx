// front/Kaptar/components/fabApp.jsx
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function FabApp() {
  const { user, logout } = useAuth(); // 👈 IMPORTA O MÉTODO LOGOUT DO SEU HOOK
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (route) => {
    setIsOpen(false);
    router.push(route);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout(); // 🚪 Limpa o token/dados no celular e o layout joga pro Login sozinho!
  };

  return (
    <View style={styles.container}>
      
      {/* SEÇÃO DE OPÇÕES EXPANSÍVEIS */}
      {isOpen && (
        <View style={styles.menuOptions}>
          
          {/* 🛠️ OPÇÃO EXCLUSIVA DE ADMIN */}
          {isAdmin && (
            <TouchableOpacity 
              style={[styles.miniButton, styles.adminButton]} 
              onPress={() => handleAction('/(tabs)/register')}
            >
              <Text style={styles.miniButtonText}>👤 Registrar Usuário</Text>
            </TouchableOpacity>
          )}

          {/* 🚚 OPÇÃO PÚBLICA */}
          <TouchableOpacity 
            style={[styles.miniButton, styles.coletaButton]} 
            onPress={() => handleAction('/(tabs)/coletas')} 
          >
            <Text style={styles.miniButtonText}>🚚 Coletas Próximas</Text>
          </TouchableOpacity>

          {/* 🚪 BOTAO DE SAIR (Acessível por todos) */}
          <TouchableOpacity 
            style={[styles.miniButton, styles.logoutButton]} 
            onPress={handleLogout} 
          >
            <Text style={styles.miniButtonText}>🚪 Sair do Sistema</Text>
          </TouchableOpacity>

        </View>
      )}

      {/* GATILHO PRINCIPAL */}
      <TouchableOpacity 
        style={[styles.fab, isOpen && styles.fabActive]} 
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>{isOpen ? '✕' : '+'}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 30, right: 30, alignItems: 'flex-end' },
  fab: {
    backgroundColor: '#0070f3', width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', elevation: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  fabActive: { backgroundColor: '#333' },
  fabText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  menuOptions: { marginBottom: 15, alignItems: 'flex-end', gap: 10 },
  miniButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20, elevation: 4 },
  coletaButton: { backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#333' },
  adminButton: { backgroundColor: '#10b981' },
  logoutButton: { backgroundColor: '#dc2626' }, // Vermelho para o botão de Sair
  miniButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
