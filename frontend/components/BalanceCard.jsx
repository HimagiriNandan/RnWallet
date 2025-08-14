import {View, Text} from 'react-native';
import { styles } from '@/assets/styles/home.styles.js';
import { COLORS } from "../constants/colors";

export const BalanceCard = ({ summary }) => {
  // Helper function to safely parse and format numbers
  const formatAmount = (value) => {
    const num = parseFloat(value) || 0;
    return num.toFixed(2);
  };

  return(
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Total Balance</Text>
      <Text style={styles.balanceAmount}>₹{formatAmount(summary?.balance)}</Text>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Income</Text>
          <Text style={[styles.balanceStatAmount, {color: COLORS.income}]}>+₹{formatAmount(summary?.income)}</Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]}></View>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Expenses</Text>
          <Text style={[styles.balanceStatAmount, {color: COLORS.expense}]}>-₹{formatAmount(Math.abs(summary?.expenses || 0))}</Text>
        </View>
      </View>
    </View>
  );
}