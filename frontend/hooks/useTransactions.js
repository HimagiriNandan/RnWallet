// react custom hook file
import { useState, useEffect, useCallback } from 'react';
import {Alert} from 'react-native';
const API_URL = 'http://localhost:5001/api'

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);

  const [summary, setSummary] = useState({
    income: 0,
    balance: 0,
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
      setSummary(data);
    }catch(err){
      console.error('Error fetching summary:', err);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try{
      //can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    }catch(err){
      console.error('Error loading data:', err);
    }finally{
      setLoading(false);
    }
  });

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