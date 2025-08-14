import { Ionicons } from "@expo/vector-icons";
import { styles } from "../assets/styles/home.styles.js";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors.js";


export default function NoTransactionsFound(){
  const router = useRouter();
  return (
    <View style={styles.emptyState}>
      <Ionicons 
        name="receipt-outline"
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
      />
      <Text style = {styles.emptyStateTitle}>No Transactions yet</Text>
      <Text style = {styles.emptyStateText}>
        Start tracking your finances by adding your first transaction
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push("/create")}>
        <Ionicons name="add-circle" size={18} color={COLORS.white}></Ionicons>
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
      </TouchableOpacity> 
    </View>
  )
}