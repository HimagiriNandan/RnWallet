import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import {View, Text, TouchableOpacity, Alert, TextInput, ActivityIndicator} from 'react-native';
import { API_URL } from '../../lib/api';
import { styles } from '../../assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  {id: "food", name: "Food & Drinks", icon: "fast-food"},
  {id: "shopping", name: "Shopping", icon: "cart"},
  {id: "transportation", name: "Transportation", icon: "car"},
  {id: "entertainment", name: "Entertainment", icon: "film"},
  {id: "bills", name: "Bills", icon: "receipt"},
  {id: "income", name: "Income", icon: "cash"},
  {id: "other", name: "Other", icon: "ellipsis-horizontal"}
]

export default function CreateScreen(){
  const router = useRouter();
  const {user, isLoaded} = useUser();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [loading, setLoading] = useState(false);

  // Don't render anything until Clerk is loaded
  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const handleCreate = async () => {
    if(!title.trim()) return Alert.alert("Error", "Please enter a transaction title");
    if(!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0){
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if(!category) return Alert.alert("Error", "Please select a category");
    setLoading(true);
    try{
      const formattedAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category: category,
        })
      });
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create transaction");
      }
      
      Alert.alert("Success", "Transaction created successfully", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/");
          }
        }
      ]);
    }catch(err){
      Alert.alert("Error", err.message || "An error occurred while creating the transaction");
    }finally{
      setLoading(false);
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text}></Ionicons>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
          style={[styles.saveButtonContainer, loading && styles.saveButtonDisabled]}
          onPress = {handleCreate}
          disabled={loading}
        >
          <Text style={styles.saveButton}>{loading ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons 
              name="arrow-down-circle"
              size={22}
              color={isExpense ? COLORS.white : COLORS.expense}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons 
              name="arrow-up-circle"
              size={22}
              color={!isExpense ? COLORS.white : COLORS.income}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={COLORS.textLight}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={22}
            color={COLORS.textLight}
            style={styles.inputIcon}
          ></Ionicons>
          <TextInput 
            style={styles.input}
            placeholder="Transaction Title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <Text style={styles.sectionTitle}>
          <Ionicons 
          name="pricetag-outline" 
          size={16} 
          color={COLORS.text}
          />
            Category
        </Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((categoryItem) => (
            <TouchableOpacity
                key={categoryItem.id}
                style={[styles.categoryButton, category === categoryItem.name && styles.categoryButtonActive]}
                onPress={() => setCategory(categoryItem.name)}
              >
                <Ionicons 
                  name={categoryItem.icon}
                  size={20}
                  color={category === categoryItem.name ? COLORS.white : COLORS.text}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[styles.categoryButtonText, category === categoryItem.name && styles.categoryButtonTextActive]}
                >
                  {categoryItem.name}
                </Text>
              </TouchableOpacity>
          ))}
        </View>
      </View>
      {loading && (
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color={COLORS.primary}></ActivityIndicator>
        </View>
      )}
    </View>
  );
}