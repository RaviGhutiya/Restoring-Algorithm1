// Event listener for starting the division algorithm
document.getElementById('start').addEventListener('click', function() {
  // Get the dividend and divisor from the user input
  const dividend = parseInt(document.getElementById('dividend').value);
  const divisor = parseInt(document.getElementById('divisor').value);
  
  // Get the bit size selected by the user (4-bit or 8-bit)
  const bitSize = parseInt(document.getElementById('bit-selection').value);
  
  // Validate inputs to ensure they are within the correct range for the selected bit size
  if (isNaN(dividend) || isNaN(divisor) || dividend < 0 || dividend >= (1 << bitSize) || divisor < 1 || divisor >= (1 << bitSize)) {
    alert(`Please enter valid ${bitSize}-bit numbers. Dividend: 0-${(1 << bitSize) - 1}, Divisor: 1-${(1 << bitSize) - 1}`);
    return;
  }

  // Initialize variables for the algorithm
  let A = 0; // Accumulator (A)
  let Q = dividend; // Quotient (Q) initialized with the dividend
  const M = divisor; // Divisor (M)
  const n = bitSize; // The number of bits (4 or 8 based on selection)
  let step = 1; // Step counter for the table rows

  // Get the tbody of the result table
  const tableBody = document.querySelector('#resultTable tbody');
  tableBody.innerHTML = ''; // Clear any previous results

  // Function to convert a number to binary with padding (4-bit or 8-bit)
  function toBinary(num, bits = 4) {
    // If the number is negative, convert it to 2's complement
    if (num < 0) num = (1 << bits) + num;
    return (num >>> 0).toString(2).padStart(bits, '0'); // Convert to binary with leading zeros
  }

  // Function to add a row to the result table
  function addRow(action) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${step}</td>
      <td>${toBinary(A, n)}</td>
      <td>${toBinary(Q, n)}</td>
      <td>${toBinary(M, n)}</td>
      <td>${action}</td>
    `;
    tableBody.appendChild(row); // Append the new row to the table
    step++; // Increment the step for the next row
  }

  // Add the initial values as the first row
  addRow('Initial Values');

  // Perform the algorithm for 'n' iterations (for 4-bit or 8-bit numbers)
  for (let i = 0; i < n; i++) {
    // Step 2: Shift Left A and Q
    const combined = (A << 1) | (Q >> (n - 1)); // Combine A and Q, shift left
    A = (combined & ((1 << n) - 1)) - ((combined & (1 << n)) ? (1 << n) : 0); // Keep A within n-bits (signed)
    Q = (Q << 1) & ((1 << n) - 1); // Shift Q left
    addRow('Shift Left A & Q');

    // Step 3: Subtract M from A
    const prevA = A; // Save the current value of A
    A = A - M; // Subtract divisor M from A
    addRow('A = A - M');

    // Step 4: Check if A is negative
    if (A < 0) {
      Q = Q & ~(1); // If A is negative, set LSB of Q to 0
      A = prevA; // Restore the previous value of A
      addRow('Restore A, Q[0] = 0');
    } else {
      Q = Q | 1; // If A is positive, set LSB of Q to 1
      addRow('Keep A, Q[0] = 1');
    }
  }

  // Step 5: Display the final quotient and remainder in binary and decimal
  const finalResult = `Quotient (Binary): ${toBinary(Q, n)}, Remainder (Binary): ${toBinary(A, n)}
    \nQuotient (Decimal): ${Q}, Remainder (Decimal): ${A}`;
  document.getElementById('final-result').textContent = finalResult;
});
