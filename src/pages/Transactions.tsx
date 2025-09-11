import React from "react";
import { Card } from "../components/Layout/ui/card";
import { Layout } from "../components/Layout/layout";

export const Transactions: React.FC = () => {
  const transactions = [
    { id: 1, date: "2025-09-01", description: "Starbucks", amount: -5.25 },
    { id: 2, date: "2025-09-02", description: "Salary", amount: 3000.0 },
    { id: 3, date: "2025-09-03", description: "Transfer to Savings", amount: -500.0 },
  ];

  return (
    <Layout>
      <Card title="Transactions">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3">Date</th>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{txn.date}</td>
                  <td className="p-3">{txn.description}</td>
                  <td
                    className={`p-3 font-semibold ${
                      txn.amount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {txn.amount < 0 ? "-" : "+"}${Math.abs(txn.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};
