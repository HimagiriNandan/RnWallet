// react custom hook file
import { useState, useEffect, useCallback } from 'react';
import {Alert} from 'react-native';
import { API_URL } from '../lib/api';

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);

  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0
  });
  const [loading, setLoading] = useState(true);

  // useCallback is used for performance optimization, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try{
      const res = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await res.json();
      console.log('Summary data received:', data); // Debug log
      setSummary({
        balance: parseFloat(data.balance) || 0,
        income: parseFloat(data.income) || 0,
        expenses: parseFloat(data.expenses) || 0
      });
    }catch(err){
      console.error('Error fetching summary:', err);
      // Set default values on error
      setSummary({
        balance: 0,
        income: 0,
        expenses: 0
      });
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if(!userId) return;
    setLoading(true);
    try{
      //can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    }catch(err){
      console.error('Error loading data:', err);
    }finally{
      setLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async(id) => {
    try{
      const res = await fetch(`${API_URL}/transactions/${id}`, {method: "DELETE"});
      if(!res.ok) throw new Error('Failed to delete transaction');

      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    }catch(err){
      console.error("Error deleting transaction:", err);
      Alert.alert("Error", err.message);
    }
  }
  return {transactions, summary, loading, loadData, deleteTransaction};
}