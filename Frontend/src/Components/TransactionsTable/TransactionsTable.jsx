import React, { useState, useEffect } from "react";
import axios from "axios";
import Statistics from "../Statistics/Statistics";
import BarChartComponent from "../BarChart/BarChart";
import PieChartComponent from "../PieChart/PieChart";
import styles from "./Transaction.module.css";
import searchimg from "./search.png";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState("03");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/transactions`,
        {
          params: { month, search, page },
        }
      );
      setTransactions(response.data);
    };
    fetchTransactions();
  }, [month, search, page]);

  return (
    <>
      <div className={styles.container}>
        <div style={{ width: "90%", height: "100%" }}>
          <div className={styles.title}>Transaction Dashboard</div>
          <div className={styles.selectbar}>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="Search transactions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchbar}
              />
              <img
                src={searchimg}
                alt="search"
                style={{ width: "20px", height: "20px" }}
              />
            </div>
            <div className={styles.filter}>
              <div className={styles.option}>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className={styles.selectedoption}
                >
                  {[
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                  ].map((m) => (
                    <option key={m} value={m}>
                      {new Date(0, m - 1).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.tableContainer}>
            {transactions.length > 0 ? (
              <table className={styles.transtable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Date of Sale</th>
                    <th>Category</th>
                    <th>Sold</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td style={{ width: "5%", textAlign: "center" }}>
                        {transaction.id}
                      </td>
                      <td style={{ width: "15%" }}>{transaction.title}</td>
                      <td style={{ width: "35%" }}>
                        {transaction.description}
                      </td>
                      <td style={{ width: "5%", textAlign: "center" }}>
                        {transaction.price}
                      </td>
                      <td style={{ width: "7%", textAlign: "center" }}>
                        {new Date(transaction.dateOfSale).toLocaleDateString()}
                      </td>
                      <td style={{ width: "10%", textAlign: "center" }}>
                        {transaction.category}
                      </td>
                      <td style={{ width: "5%", textAlign: "center" }}>
                        {transaction.sold ? "Yes" : "No"}
                      </td>
                      <td style={{ width: "10%", textAlign: "center" }}>
                        <img
                          src={transaction.image}
                          alt="sample"
                          className={styles.sampleimg}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.message}>You don't have any Transaction</div>
            )}
          </div>
          <div className={styles.footer}>
            <div>Page No:{page} </div>
            <div className={styles.buttons}>
              <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>
                Previous
              </button>
              <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
            <div>Per Page: 5</div>
          </div>

          <div className={styles.statistics}>
            <Statistics month={month} />
          </div>
          <div className={styles.barchart}>
            <BarChartComponent month={month} />
          </div>
          <div className={styles.piechart}>
            <PieChartComponent month={month} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionsTable;
