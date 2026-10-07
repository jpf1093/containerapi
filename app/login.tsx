import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { styles } from "@/styles/login.styles";

type LoginResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "OPERATOR";
  };
  token: string;
};

const LOGIN_URL =
  "https://containerapi-jjdb.onrender.com/api/auth/login";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================================
  // TESTE TEMPORÁRIO DE REDE
  // =========================================================

  async function testarRede() {
    console.log("");
    console.log("========== TESTE DE REDE ==========");

    const testes = [
      {
        nome: "Google",
        url: "https://www.google.com",
      },
      {
        nome: "Render raiz",
        url: "https://containerapi-jjdb.onrender.com",
      },
      {
        nome: "Render login GET",
        url: "https://containerapi-jjdb.onrender.com/api/auth/login",
      },
    ];

    for (const teste of testes) {
      console.log("");
      console.log("--------------------------------");
      console.log(`TESTANDO: ${teste.nome}`);
      console.log(`URL: ${teste.url}`);

      try {
        const inicio = Date.now();

        const response = await fetch(teste.url);

        const tempo = Date.now() - inicio;

        console.log(`SUCESSO: ${teste.nome}`);
        console.log(`STATUS: ${response.status}`);
        console.log(`OK: ${response.ok}`);
        console.log(`TEMPO: ${tempo}ms`);
      } catch (error) {
        console.error(`FALHOU: ${teste.nome}`);
        console.error("ERRO:", error);
      }
    }

    console.log("");
    console.log("========== FIM DO TESTE ==========");
    console.log("");
  }

  // =========================================================
  // LOGIN
  // =========================================================

  async function handleLogin() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert(
        "Campos obrigatórios",
        "Informe seu email e sua senha.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      // -------------------------------------------------------
      // PRIMEIRO TESTAMOS A REDE
      // -------------------------------------------------------

      await testarRede();

      // -------------------------------------------------------
      // DEPOIS TESTAMOS O POST DO LOGIN
      // -------------------------------------------------------

      console.log("");
      console.log("========== TESTE LOGIN POST ==========");
      console.log("URL:", LOGIN_URL);
      console.log("EMAIL:", normalizedEmail);

      const response = await fetch(LOGIN_URL, {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      console.log("STATUS:", response.status);
      console.log("OK:", response.ok);

      const responseText = await response.text();

      console.log("RESPOSTA:", responseText);
      console.log("========== FIM LOGIN POST ==========");

      if (!response.ok) {
        let message = "Email ou senha inválidos.";

        try {
          const errorData = JSON.parse(responseText);

          if (errorData?.message) {
            message = errorData.message;
          }
        } catch {
          console.log(
            "Resposta de erro não estava em JSON.",
          );
        }

        Alert.alert(
          "Não foi possível entrar",
          message,
        );

        return;
      }

      // -------------------------------------------------------
      // CONVERTE RESPOSTA
      // -------------------------------------------------------

      let data: LoginResponse;

      try {
        data = JSON.parse(
          responseText,
        ) as LoginResponse;
      } catch (error) {
        console.error(
          "Erro ao converter resposta para JSON:",
          error,
        );

        Alert.alert(
          "Erro",
          "O servidor retornou uma resposta inválida.",
        );

        return;
      }

      // -------------------------------------------------------
      // VALIDA RESPOSTA
      // -------------------------------------------------------

      if (!data.user || !data.token) {
        console.error(
          "Resposta inesperada do servidor:",
          data,
        );

        Alert.alert(
          "Erro",
          "A resposta do servidor não contém usuário ou token.",
        );

        return;
      }

      // -------------------------------------------------------
      // LOGIN REALIZADO
      // -------------------------------------------------------

      console.log("");
      console.log("LOGIN REALIZADO COM SUCESSO");
      console.log("USUÁRIO:", data.user);
      console.log("ROLE:", data.user.role);
      console.log("");

      await login(
        data.user,
        data.token,
      );
    } catch (error) {
      console.error("");
      console.error(
        "========== ERRO LOGIN ==========",
      );

      console.error(error);

      console.error(
        "================================",
      );
      console.error("");

      Alert.alert(
        "Erro de conexão",
        "Não foi possível conectar ao servidor.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // =========================================================
  // INTERFACE
  // =========================================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.content}>
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons
              name="leaf-outline"
              size={42}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.title}>
            Kaptar
          </Text>

          <Text style={styles.subtitle}>
            Gestão inteligente de containers
          </Text>
        </View>

        {/* FORMULÁRIO */}

        <View style={styles.form}>
          {/* EMAIL */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#64748B"
              />

              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* SENHA */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Senha
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#64748B"
              />

              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!isSubmitting}
              />

              <Pressable
                onPress={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                disabled={isSubmitting}
                hitSlop={10}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#64748B"
                />
              </Pressable>
            </View>
          </View>

          {/* BOTÃO LOGIN */}

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,

              pressed &&
                styles.loginButtonPressed,

              isSubmitting &&
                styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <>
                <Text
                  style={
                    styles.loginButtonText
                  }
                >
                  Entrar
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}