import { Button } from "@material-tailwind/react";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";

const App = () => {
  const [balance, setbalance] = useState("");
  const amount = async () => {
  const res = await fetch(`http://localhost:3000/api/v1/payments/getAmount`, {
    method: "GET",
    headers: {
        "content-type": "application/json"
    },   
});
const data = await res.json();
console.log(data);
setbalance(data.amount);

}

setTimeout(() => {
  amount();
},30000)

  return (
    <div className="bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
      <div className="flex justify-end mr-20">
      <Button onClick={()=>amount()}  className="px-6 py-3 mt-5">{balance}</Button>
      </div>
    
    <section className="flex justify-center items-center h-screen  text-white">
    
    <ProductCard/>
    </section>
    </div>
  );
}

export default App;