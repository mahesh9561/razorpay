import './App.css';

function App() {
  const paymentHandler = async (e) => {
    const amount = 1;
    const currency = "INR";
    const receiptId = '2234567';
    const response = await fetch('http://localhost:3005/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId
      })
    })
    const data = await response.json();
    console.log(data);

    const option = {
      key: '',
      amount,
      currency,
      name: 'Creaters',
      description: 'Test Transaction',
      order_id: data.id,
      handler: async function (response) {

        const body = { ...response }
        const validateResponse = await fetch('http://localhost:3005/orders/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        const jsonRequest = await validateResponse.json();
        console.log('jsonRequest', jsonRequest)
      },
      prefill: {
        name: 'Mahesh Pathak',
        email: 'maheshpathak200@gmail.com',
        contact: '9561014018'
      },
      theme: {
        color: '#F37254'
      },
    };
    var rzp1 = new window.Razorpay(option);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    })

    rzp1.open();
    e.preventDefault();
  }
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center flex-col gap-4">
        <h1 className=" font-semibold text-2xl">Razorpay Payment Gateway</h1>
        <button className=" border px-4 py-2 rounded-md shadow-xl" onClick={paymentHandler} >Pay Now</button>
      </div>

    </>
  );
}

export default App;
