<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل دخول</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css">
</head>
<body>
    <div class="container mt-5" data-aos="fade-up">
        <h2 class="text-center">تسجيل الدخول</h2>
        <form id="loginForm">
            <div class="mb-3">
                <label for="username" class="form-label">اسم المستخدم</label>
                <input type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">كلمة المرور</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">تسجيل دخول</button>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        AOS.init();

        // بيانات المستخدمين في ملف JSON (يمكنك تغييره لتحميل البيانات من ملف خارجي)
        const users = [
            { username: "user1", password: "pass1" },
            { username: "user2", password: "pass2" }
        ];

        let attempts = 0;
        const maxAttempts = 3;

        // دالة لجلب عنوان IP (يمكنك استخدام خدمة API مثل https://api.ipify.org)
        async function getIPAddress() {
            try {
                let response = await fetch('https://api.ipify.org?format=json');
                let data = await response.json();
                return data.ip;
            } catch (error) {
                console.error('Error fetching IP:', error);
                return 'unknown';
            }
        }

        document.getElementById('loginForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const ipAddress = await getIPAddress();

            // تحقق إذا كان IP محظور
            fetch('blocked_ips.txt')
                .then(response => response.text())
                .then(data => {
                    if (data.includes(ipAddress)) {
                        Swal.fire({
                            icon: 'error',
                            title: 'تم حظر هذا الجهاز',
                            text: 'تم حظر محاولات الدخول لهذا الجهاز!'
                        });
                        return;
                    } else {
                        // تحقق من بيانات تسجيل الدخول
                        const user = users.find(user => user.username === username && user.password === password);

                        if (user) {
                            Swal.fire({
                                icon: 'success',
                                title: 'تسجيل دخول ناجح',
                                text: 'مرحبًا بك!'
                            });
                            attempts = 0; // إعادة المحاولات إذا كانت ناجحة
                        } else {
                            attempts++;
                            Swal.fire({
                                icon: 'error',
                                title: 'خطأ في تسجيل الدخول',
                                text: `محاولة ${attempts} من ${maxAttempts}`
                            });

                            if (attempts >= maxAttempts) {
                                // حظر عنوان IP
                                fetch('blocked_ips.txt', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ ip: ipAddress })
                                });
                                Swal.fire({
                                    icon: 'error',
                                    title: 'تم حظر الجهاز',
                                    text: 'لقد تجاوزت الحد المسموح به من المحاولات!'
                                });
                            }
                        }
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    </script>
</body>
</html>
