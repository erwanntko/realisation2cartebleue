import Navbar from "@/components/navbar";
import CarContainer from "@/components/carContainer";
import CreateSaleButton from "@/components/createSale";

export default function Home() {
  return (
    <div>
        <Navbar />
        <CarContainer />
        <CreateSaleButton />
    </div>
  );
}