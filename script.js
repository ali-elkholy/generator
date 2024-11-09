
    // دالة تسجيل الخروج
    function logout() {
        sessionStorage.removeItem("isLoggedIn");
        window.location.href = "login.html";
    }

    // دالة التحقق من حالة تسجيل الدخول
    function checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (!isLoggedIn || isLoggedIn !== "true") {
            alert('Access Denied. Please log in first.');
            window.location.href = "index.html";
        }
    }

    // دالة للحصول على الموقع الجغرافي والـ IP
    async function getLocationAndIP() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            const ip = data.ip;
            const city = data.city;
            const region = data.region;
            const country = data.country_name;
            const locationInfo = `IP: ${ip},  ${city}, ${region}, ${country}`;
            
            document.getElementById('locationInfo').textContent = locationInfo;
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    }

    // استدعاء التحقق عند تحميل الصفحة
    checkLoginStatus();
    // استدعاء دالة الحصول على الموقع الجغرافي والـ IP
    getLocationAndIP();
