import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* 🚀 Definindo o GPS primeiro, ele vira a tela padrão do grupo (tabs) */}
      <Tabs.Screen 
        name="gps" 
        options={{ 
          title: 'Mapa GPS',
          // Aqui você pode adicionar ícones nativos se quiser
        }} 
      />
      
      {/* Outras telas do seu app */}
      <Tabs.Screen name="coletas" options={{ title: 'Coletas' }} />
      <Tabs.Screen name="rotas" options={{ title: 'Rotas' }} />
      
      {/* Ocultando telas que não precisam de botão na barra inferior (como o registro) */}
      <Tabs.Screen 
        name="register" 
        options={{ 
          href: null, // 👈 Isso esconde o botão da barra inferior de navegação!
        }} 
      />
      <Tabs.Screen name="configContainers" options={{ href: null }} />
      <Tabs.Screen name="configOperadores" options={{ href: null }} />
      <Tabs.Screen name="filtro" options={{ href: null }} />
    </Tabs>
  );
}
