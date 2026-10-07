import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  header: {
    alignItems: "center",
    marginBottom: 48,
  },

  logoContainer: {
    width: 82,
    height: 82,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    marginBottom: 18,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#64748B",
  },

  form: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  inputContainer: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
  },

  loginButton: {
    minHeight: 56,
    marginTop: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#16A34A",
  },

  loginButtonPressed: {
    opacity: 0.85,
  },

  loginButtonDisabled: {
    opacity: 0.65,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});