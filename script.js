document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('order-form');

    form.addEventListener('submit', function(event) {
        // Prevent the default form submission which reloads the page
        event.preventDefault();

        // --- Basic Validation ---
        const customerName = document.getElementById('customer-name').value.trim();
        const phoneNumber = document.getElementById('phone-number').value.trim();
        const productType = document.getElementById('product-type').value.trim();
        const quantity = document.getElementById('quantity').value.trim();
        const deliveryDate = document.getElementById('delivery-date').value.trim();

        if (!customerName || !phoneNumber || !productType || !quantity || !deliveryDate) {
            alert('Please fill out all fields.');
            return; // Stop the function if validation fails
        }

        // If validation passes, show a success message
        alert('Form submitted successfully! (No backend yet)');

        // Here you would typically send the data to a server.
        // For now, we can just log it to the console.
        console.log('Form Data:', {
            customerName,
            phoneNumber,
            productType,
            quantity,
            deliveryDate
        });

        // Optionally, reset the form
        form.reset();
    });
});
