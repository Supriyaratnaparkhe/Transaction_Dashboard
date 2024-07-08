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
        <div>
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
                style={{ width: "30px", height: "30px" }}
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
              <table className={styles.quiztable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Date of Sale</th>
                    <th>Category</th>
                    <th>Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{transaction._id}</td>
                      <td>{transaction.title}</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.price}</td>
                      <td>
                        {new Date(transaction.dateOfSale).toLocaleDateString()}
                      </td>
                      <td>{transaction.category}</td>
                      <td>{transaction.sold ? "Yes" : "No"}</td>
                      <td>{transaction.image}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.message}>You don't have any Quiz</div>
            )}
          </div>
          <div>
            <div>Page No:{page} </div>
            <div></div>
            <div>Per Page: 5</div>
          </div>
        </div>
        <div>
          <div className={styles.statistics}></div>
          <div className={styles.barchart}></div>
          <div className={styles.piechart}></div>
        </div>
      </div>

      {/* <div className={styles.container}>
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
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
            {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search transactions"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction._id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? "Yes" : "No"}</td>
              <td>{transaction.image}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
      <div>
        <Statistics month={month} />
        <BarChartComponent month={month} />
        <PieChartComponent month={month} />
      </div>
    </div> */}
    </>
  );
};

export default TransactionsTable;
