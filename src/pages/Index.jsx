import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const Index = () => {
  const [isAddingTransaction, setIsAddingTransaction] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState(null);
  const queryClient = useQueryClient();

  // Simulated API calls
  const fetchTransactions = async () => {
    // In a real app, this would be an API call
    return [
      { id: 1, date: '2024-03-01', amount: 200, type: 'expense', category: 'Nike' },
      { id: 2, date: '2024-03-05', amount: 300, type: 'income', category: 'Adidas' },
      { id: 3, date: '2024-03-10', amount: 150, type: 'expense', category: 'Jordan' },
    ];
  };

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const addTransaction = useMutation({
    mutationFn: (newTransaction) => {
      // Simulated API call
      return Promise.resolve({ 
        ...newTransaction, 
        id: Date.now(),
        amount: parseFloat(newTransaction.amount)
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['transactions'], (old) => [...old, data]);
      setIsAddingTransaction(false);
    },
  });

  const updateTransaction = useMutation({
    mutationFn: (updatedTransaction) => {
      // Simulated API call
      return Promise.resolve({
        ...updatedTransaction,
        amount: parseFloat(updatedTransaction.amount)
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['transactions'], (old) =>
        old.map((t) => (t.id === data.id ? data : t))
      );
      setEditingTransaction(null);
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: (id) => {
      // Simulated API call
      return Promise.resolve(id);
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['transactions'], (old) =>
        old.filter((t) => t.id !== id)
      );
    },
  });

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Sneaker Side-Hustle Accounting</h1>
      
      {!isAddingTransaction && !editingTransaction && (
        <Button 
          onClick={() => setIsAddingTransaction(true)}
          className="mb-4"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      )}

      {(isAddingTransaction || editingTransaction) && (
        <TransactionForm
          onSubmit={(transaction) => {
            if (editingTransaction) {
              updateTransaction.mutate(transaction);
            } else {
              addTransaction.mutate(transaction);
            }
          }}
          onCancel={() => {
            setIsAddingTransaction(false);
            setEditingTransaction(null);
          }}
          initialData={editingTransaction}
        />
      )}

      <TransactionList
        transactions={transactions}
        onEdit={setEditingTransaction}
        onDelete={(id) => deleteTransaction.mutate(id)}
      />
    </div>
  );
};

export default Index;