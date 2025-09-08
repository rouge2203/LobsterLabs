import React, { useEffect, useRef, useState } from "react";

function Paypal() {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [donationAmount, setDonationAmount] = useState(10);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const paypalRef = useRef();

  const totalDonation = isCustomAmount
    ? parseFloat(customAmount || 0).toFixed(2)
    : donationAmount.toFixed(2);

  useEffect(() => {
    // Load PayPal SDK script
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AZpOHDGAgKBo5cXqS7VnD6RMEWNGBKi9E3nKKztd-cCLijsLU6ndohaMAyYvajI-362YXcQz2Zb4x33p&currency=USD";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && window.paypal && paypalRef.current && !showSuccess) {
      // Clear any existing PayPal buttons
      paypalRef.current.innerHTML = "";

      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay",
            height: 50,
          },
          createOrder: async () => {
            try {
              const r = await fetch(
                "https://laticacr.com/api/paypal/create-order",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    amount: totalDonation,
                    custom_id: `TICKETS:${ticketQuantity}|SHOW:2025-12-01|EMAIL:${email}`,
                    invoice_id: `ORD-${Date.now()}`,
                    tickets: ticketQuantity,
                    email: email,
                  }),
                }
              );

              if (!r.ok) {
                throw new Error(`API Error: ${r.status}`);
              }

              const data = await r.json();
              return data.id;
            } catch (error) {
              console.error("CreateOrder error:", error);
              alert("Error al procesar el pedido. Por favor intenta de nuevo.");
              throw error;
            }
          },
          onApprove: async (data) => {
            try {
              const r = await fetch(
                "https://laticacr.com/api/paypal/capture-order",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderID: data.orderID,
                    tickets: ticketQuantity,
                    email: email,
                  }),
                }
              );

              if (!r.ok) {
                throw new Error(`Capture Error: ${r.status}`);
              }

              const result = await r.json();
              if (result.status === "COMPLETED") {
                setShowSuccess(true);
              }
            } catch (error) {
              console.error("OnApprove error:", error);
              alert("Error al confirmar el pago. Por favor contacta soporte.");
            }
          },
          onError: function (err) {
            console.error("PayPal error:", err);
            alert(
              "Ocurrió un error durante el proceso de pago. Por favor intenta de nuevo."
            );
          },
        })
        .render(paypalRef.current);
    }
  }, [isScriptLoaded, totalDonation, ticketQuantity, email, showSuccess]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTicketChange = (quantity) => {
    setTicketQuantity(quantity);
  };

  const handleDonationChange = (amount) => {
    setDonationAmount(amount);
    setIsCustomAmount(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setCustomAmount(value);
      setIsCustomAmount(true);
    }
  };

  const isValidDonation = () => {
    const amount = isCustomAmount
      ? parseFloat(customAmount || 0)
      : donationAmount;
    return amount >= 5;
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Pago Exitoso!
            </h2>
            <p className="text-gray-600 mb-4">
              Tu donación de <strong>${totalDonation}</strong> ha sido procesada
              exitosamente.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-medium">
                📧 Tus {ticketQuantity} boleto{ticketQuantity > 1 ? "s" : ""}{" "}
                será{ticketQuantity > 1 ? "n" : ""} enviado
                {ticketQuantity > 1 ? "s" : ""} a:
              </p>
              <p className="text-blue-900 font-bold">{email}</p>
            </div>
            <p className="text-sm text-gray-500">
              Los boletos llegarán a tu correo en los próximos 5-10 minutos.
            </p>
          </div>
          <button
            onClick={() => {
              setShowSuccess(false);
              setTicketQuantity(1);
              setEmail("");
              setDonationAmount(10);
              setIsCustomAmount(false);
              setCustomAmount("");
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Comprar Más Boletos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-4">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  1
                </div>
                <span className="ml-2 text-blue-600 font-medium">Evento</span>
              </div>
              <div className="h-px w-16 bg-blue-600"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-blue-600 font-medium">Boletos</span>
              </div>
              <div className="h-px w-16 bg-blue-600"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-blue-600 font-medium">Pago</span>
              </div>
              <div className="h-px w-16 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                  4
                </div>
                <span className="ml-2 text-gray-500 font-medium">
                  Confirmación
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Panel - Event Details */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Evento{" "}
                  <span className="text-sm font-normal text-gray-500">
                    ({ticketQuantity} boleto{ticketQuantity > 1 ? "s" : ""})
                  </span>
                </h2>
                <button className="text-red-500 text-sm hover:text-red-600">
                  🗑 Limpiar todo
                </button>
              </div>

              {/* Concert Event Card */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl">
                    🎵
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      Concierto Épico
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Concierto Ingrid Rosario
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      📅 26 de Octubre, 2025 • 🕒 3:00 PM
                    </p>
                    <p className="text-gray-500 text-xs">
                      📍 Auditorio Vision de Multitudes, Cartago
                    </p>

                    {/* Ticket Quantity Selector */}
                    <div className="flex items-center mt-3 space-x-2">
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleTicketChange(num)}
                          className={`w-8 h-8 rounded border-2 text-sm font-medium transition duration-200 ${
                            ticketQuantity === num
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">
                      ${totalDonation}
                    </p>
                    <button className="text-red-400 hover:text-red-600 mt-2">
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              {/* Donation Amount Selection */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-4">
                  Cantidad de Donación
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[5, 10, 15].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleDonationChange(amount)}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition duration-200 ${
                        !isCustomAmount && donationAmount === amount
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Cantidad personalizada (mín. $5)"
                    className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none transition duration-200 ${
                      isCustomAmount
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                </div>
                {isCustomAmount &&
                  parseFloat(customAmount || 0) < 5 &&
                  customAmount !== "" && (
                    <p className="text-red-500 text-xs mt-1">
                      La donación mínima es de $5
                    </p>
                  )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-4">
                  Resumen de Donación
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donación</span>
                    <span className="text-gray-800">${totalDonation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Boletos incluidos</span>
                    <span className="text-gray-800">{ticketQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Procesamiento</span>
                    <span className="text-green-600">GRATIS</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-xl text-gray-800">
                      ${totalDonation}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Checkout */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Checkout
              </h2>

              {/* Payment Methods */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-8 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-12 h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-12 h-8 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  PP
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico donde llegarán los boletos
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* PayPal Payment Section */}
              {email && email.includes("@") && isValidDonation() ? (
                <div className="mb-6">
                  {!isScriptLoaded ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                      <p className="text-gray-600">
                        Cargando opciones de pago...
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div
                        ref={paypalRef}
                        id="paypal-button-container"
                        className="mb-4"
                      ></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
                  <p className="text-gray-600">
                    {!email || !email.includes("@")
                      ? "⬆️ Ingresa tu correo electrónico para continuar"
                      : "⬆️ Selecciona una donación válida (mínimo $5)"}
                  </p>
                </div>
              )}

              {/* Alternative Payment Button */}
              <button
                disabled={!email || !email.includes("@") || !isValidDonation()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition duration-200 mb-6"
              >
                Donar ahora
              </button>

              {/* Security Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>🔒 Pago 100% seguro y encriptado</p>
                <p>📧 Los boletos se envían por correo electrónico</p>
                <p>🎵 Apoya la música local costarricense</p>
                <p>
                  ❤️ Donación mínima de $5, máximo 3 boletos por transacción
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Paypal;
