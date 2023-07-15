# E-Ticaret-Uygulaması

Bu projenin client tarafı React, server tarafı ASP.NET Core ile yazılmıştır.

## Projeye başlamadan yapılması gerekenler

Başlangıç olarak proje içerisinde bulunan SQL sorgusu MSSQL üzerinde çalıştırılması gerekir.
Sonraki aşamada ise client ve server tarafında paketlerin indirilmesi gerekmektedir.

Server tarafı için:
- appsettings.json dosyası içinde SqlConnection oluşturulan veritabanı ismine göre düzenlenmelidir.
- EmailConfiguration kısmındaki Username ve Password alanları kullanılacak olan hesaba göre ayarlanmalıdır.
- Controllers->PdfController kısmındaki dosya yolları kullanılan bilgisayara göre ayarlanmalıdır.(Buradaki istekler yazılmış olup proje üzerinde şu anlık kullanılmamaktadır)
- Controllers->OrderController->OrderWithCreditCard isteği içinde ApiKey ve SecretKey Iyzico'dan alınan anahtar değerleri girilmelidir.
- Controllers->EmailController kısmındaki email kullanılacak olan emaile göre ayarlanmalıdır.

Kullanıcı hesabı oluşturulduktan sonra eğer Admin kullanıcısı oluşturulmak isteniyorsa MSSQL üzerinden Users tablosunda bulunan kullanıcının rolü 1 olarak değiştirilmelidir.

## İletişim

[Github](https://github.com/aykuthrmnc)

[LinkedIn](https://www.linkedin.com/in/aykuthrmnc/)
