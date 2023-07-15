--CREATE DATABASE ECommerceApp

USE ECommerceApp

CREATE TABLE Roles(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
)

INSERT INTO Roles (Name) VALUES ('Admin')
INSERT INTO Roles (Name) VALUES ('Supplier')
INSERT INTO Roles (Name) VALUES ('Customer')

CREATE TABLE Users(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	RoleId INT FOREIGN KEY REFERENCES Roles(Id) DEFAULT (3) NOT NULL,
	Username NVARCHAR(50) NOT NULL,
	PasswordHash VARBINARY(MAX) NOT NULL,
	PasswordSalt VARBINARY(MAX) NOT NULL,
	FirstName NVARCHAR(50) NOT NULL,
	LastName NVARCHAR(50) NOT NULL,
	Email NVARCHAR(50) NOT NULL,
	PhoneNumber NVARCHAR(50) NOT NULL,
	CreatedAt DATETIME2 DEFAULT GETDATE(),
	ModifiedAt DATETIME2,
)

CREATE TABLE UserPayments(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	UserId INT FOREIGN KEY REFERENCES Users(Id) NOT NULL,
	PaymentType NVARCHAR(50) NOT NULL,
	AccountName NVARCHAR(50) NOT NULL,
	AccountNumber INT NOT NULL,
	ExpiryDate DATE NOT NULL,
)

CREATE TABLE Locations(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	UserId INT FOREIGN KEY REFERENCES Users(Id) NOT NULL,
	PhoneNumber NVARCHAR(50),
	AddressLine1 NVARCHAR(100),
	AddressLine2 NVARCHAR(100),
	Country NVARCHAR(50),
	City NVARCHAR(50),
	ZipCode INT,
	Description NVARCHAR(50),
)

CREATE TABLE Categories(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	Url NVARCHAR(50),
	Description NVARCHAR(50),
	CreatedAt DATETIME2 DEFAULT GETDATE(),
	ModifiedAt DATETIME2,
	DeletedAt DATETIME2,
	MainCategoryId INT,
	ImageUrl NVARCHAR(50),
)

--INSERT INTO Categories (Name, Url, Description) VALUES ('Elektronik', 'elektronik', 'Elektronik Kategorisi')
--INSERT INTO Categories (Name, Url, Description) VALUES ('Moda', 'moda', 'Moda Kategorisi')
--INSERT INTO Categories (Name, Url, Description) VALUES ('Ofis-Kýrtasiye', 'ofis-kirtasiye', 'Ofis-Kýrtasiye Kategorisi')

CREATE TABLE Products(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	CategoryId INT FOREIGN KEY REFERENCES Categories(Id) NOT NULL,
	--InventoryId INT FOREIGN KEY REFERENCES Inventories(Id) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	Url NVARCHAR(50) NOT NULL,
	Price DECIMAL DEFAULT(0) NOT NULL,
	Quantity INT DEFAULT(1) NOT NULL,
	Discount DECIMAL DEFAULT(0),
	Description NVARCHAR(50),
	ImageUrl NVARCHAR(50),
	IsActive BIT DEFAULT(1),
	IsApproved BIT DEFAULT(0),
	IsHome BIT DEFAULT(0),
	CreatedAt DATETIME2 DEFAULT GETDATE(),
	ModifiedAt DATETIME2,
	DeletedAt DATETIME2,
)

CREATE TABLE Carts(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	ProductId INT FOREIGN KEY REFERENCES Products(Id) NOT NULL,
	UserId INT FOREIGN KEY REFERENCES Users(Id) NOT NULL,
	Quantity INT NOT NULL,
	CreatedAt DATETIME2 DEFAULT GETDATE(),
	ModifiedAt DATETIME2,
)

CREATE TABLE Orders(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	UserId INT FOREIGN KEY REFERENCES Users(Id) NOT NULL,
	PaymentId INT FOREIGN KEY REFERENCES UserPayments(Id) NOT NULL,
	FirstName NVARCHAR(50),
	LastName NVARCHAR(50),
	PhoneNumber NVARCHAR(50),
	AddressLine1 NVARCHAR(50),
	Country NVARCHAR(50),
	City NVARCHAR(50),
	ZipCode INT,
	Description NVARCHAR(50),
	OrderState BIT,
	CreatedAt DATETIME2 DEFAULT GETDATE(),
	ModifiedAt DATETIME2,
)

CREATE TABLE OrderItems(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	OrderId INT FOREIGN KEY REFERENCES Orders(Id) NOT NULL,
	ProductId INT FOREIGN KEY REFERENCES Products(Id) NOT NULL,
	Price DECIMAL NOT NULL,
	Quantity INT NOT NULL,
	CreatedAt DATETIME2 DEFAULT GETDATE(),
	ModifiedAt DATETIME2,
)

CREATE TABLE ProductRatings(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	ProductId INT FOREIGN KEY REFERENCES Products(Id) NOT NULL,
	UserId INT FOREIGN KEY REFERENCES Users(Id) NOT NULL,
	OrderId INT FOREIGN KEY REFERENCES Orders(Id) NOT NULL,
	Description NVARCHAR(255),
	Rating INT CONSTRAINT Rating_Range CHECK (Rating IN (1, 2, 3, 4, 5)),
	RatingDate DATETIME2 DEFAULT GETDATE(),
)

CREATE TABLE ProductImages(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	ProductId INT FOREIGN KEY REFERENCES Products(Id) NOT NULL,
	ImageUrl NVARCHAR(50),
)

--CREATE TABLE Inventories(
--	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
--	Name NVARCHAR(50) NOT NULL,
--	Quantity INT DEFAULT(1) NOT NULL,
--	CreatedAt DATETIME2 DEFAULT GETDATE(),
--	ModifiedAt DATETIME2,
--	DeletedAt DATETIME2,
--)

--INSERT INTO Inventories (Id, Name) VALUES (1, 'Ana Konum')

--CREATE TABLE Inventory(
--	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
--	Quantity INT,
--	CreatedAt DATETIME2 DEFAULT GETDATE(),
--	ModifiedAt DATETIME2 DEFAULT GETDATE(),
--	DeletedAt DATETIME2 DEFAULT GETDATE(),
--)

--CREATE TABLE Carts(
--	Id INT PRIMARY KEY IDENTITY(1,1),
--	UserId INT FOREIGN KEY REFERENCES Users(Id),
--)


--CREATE TABLE ProductCarts(
--	Id INT PRIMARY KEY IDENTITY(1,1),
--	ProductId INT FOREIGN KEY REFERENCES Products(Id),
--	CartId INT FOREIGN KEY REFERENCES Carts(Id),
--	Quantity INT,
--)

---- PAGINATION
--DECLARE @PageNumber INT, @PageSize INT
--SET @PageNumber = 1
--SET @PageSize = 5
--SELECT * FROM Products ORDER BY Id
--OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY

---- CONDITIONAL INSERT-UPDATE
--IF EXISTS(SELECT * FROM Carts where UserId = 1 and ProductId = 1)
--UPDATE Carts SET Quantity = CASE WHEN Quantity + 5 > 0 THEN Quantity + 5 ELSE Quantity END where UserId = 1 and ProductId = 1
--ELSE INSERT INTO Carts (UserId, ProductId, Quantity) values (1, 1, 5)

---- CONDITIONAL INSERT-UPDATE-DELETE
--IF EXISTS(SELECT * FROM Carts where UserId = 1 and ProductId = 1)
--UPDATE Carts SET Quantity = Quantity + 5 where UserId = 1 and ProductId = 1
--ELSE INSERT INTO Carts (UserId, ProductId, Quantity) values (1, 1, 5)
--IF ((SELECT Carts.Quantity FROM Carts where UserId = 1 and ProductId = 5) < 0)
--DELETE FROM Carts WHERE UserId = 1 and ProductId = 5