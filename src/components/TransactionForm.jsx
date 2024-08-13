import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const TransactionForm = ({ onSubmit, onCancel, initialData }) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      amount: '',
      type: 'expense',
      category: '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  const watchType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input type="date" id="date" {...register('date', { required: true })} />
      </div>
      
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input type="number" id="amount" {...register('amount', { required: true, min: 0 })} />
      </div>
      
      <div>
        <Label htmlFor="type">Type</Label>
        <Select onValueChange={(value) => setValue('type', value)} defaultValue={watchType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => setValue('category', value)} defaultValue={initialData?.category || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nike">Nike</SelectItem>
            <SelectItem value="Adidas">Adidas</SelectItem>
            <SelectItem value="Jordan">Jordan</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit">{initialData ? 'Update' : 'Add'} Transaction</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default TransactionForm;