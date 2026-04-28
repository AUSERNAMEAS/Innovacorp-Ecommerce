CREATE DATABASE Ventas

create table cliente(
id_cliente int primary key identity(1,1) not null,
nombre varchar(40) not null,
contrasenia_hash varchar(250) not null,
apellido char(20),
correo char(40) unique not null,
telefono char(10),
direccion char(40),
ciudad char(15),
codigo_postal char(7),
pais char(15),
fecha_Compra date,
rol varchar(20) DEFAULT 'cliente')

DROP DATABASE Ventas

select * from cliente
--id google and contraseña not null
alter table cliente alter column contrasenia_hash varchar(255) null
alter table cliente add google_id varchar(255) null,foto_perfil VARCHAR(MAX) NULL;

UPDATE cliente
            SET telefono = '92457243'
            WHERE correo = 'accusy4@gmail.com'                      

--insert into cliente(nombre,correo) values('Phoenix','pelos@gmail.com')

--update cliente set fecha_Compra= GETDATE() where id_cliente = 1;

alter table cliente alter column nombre varchar(40) not null

insert into cliente(nombre,correo,contrasenia_hash,rol) values ('cu','pelos@gmail.com', 'pelos1234', 'admin');

delete from cliente where id_cliente = 1


update cliente set rol = 'admin' where correo = 'admin@gmail.com '   

SELECT correo, contrasenia_hash, rol 
FROM cliente 
WHERE correo = 'pelos@gmail.com';


truncate table cliente

delete from cliente where id_cliente = 1

--añadir campo imagenes
create table producto(
id_producto int primary key identity(1,1) not null,
nombre varchar(30),
descripcion varchar(60),
stock int,
categoria varchar(20),
peso_kg varchar(10),
estado_producto varchar(20)
)

alter table producto add precio_unitario money
ALTER TABLE producto ADD imagen VARCHAR(100);

select * from producto
SELECT IDENT_CURRENT('producto')
SELECT MAX(id_producto) FROM producto


DELETE FROM producto

-- INSERT INTO: Consulta para insertar los 10 productos con todos los campos.
INSERT INTO producto 
(nombre, descripcion, stock, categoria, peso_kg, estado_producto, precio_unitario, imagen) 
VALUES
('Taza Jin', 'Contenedor de bebida temático.', 8, 'termo/taza', '0.4kg', 'Activo', 150.00, 'img/products/taza.jpg'),

('Camisa Golden', 'Prenda de vestir de colección.', 7, 'prenda', '0.7kg', 'Activo', 250.00, 'img/products/camisanegra.jpg'),

('Photocaras', 'Accesorio coleccionable.', 10, 'freebe', '0.05kg', 'Activo', 30.00, 'img/products/photocaras.jpg'),

('Camisa Indigo', 'Prenda de vestir de colección.', 6, 'prenda', '0.7kg', 'Activo', 200.00, 'img/products/camisaazul.jpg'),

('Suéter Navideño BTS', 'Prenda de vestir de colección.', 5, 'prenda', '0.7kg', 'Activo', 300.00, 'img/products/sudadera.jpg'),

('Llavero', 'Accesorio coleccionable.', 9, 'freebe', '0.05kg', 'Activo', 50.00, 'img/products/llavero.jpg'),

('Termo I AM STILL', 'Contenedor de bebida temático.', 8, 'termo/taza', '0.4kg', 'Activo', 195.00, 'img/products/termo.jpg'),

('Frazada Viajera', 'Prenda de vestir o manta de colección.', 6, 'prenda', '1.0kg', 'Activo', 140.00, 'img/products/frazada.jpg'),

('Sudadera Jungkook Tattoo', 'Prenda de vestir de colección.', 7, 'prenda', '0.7kg', 'Activo', 560.00, 'img/products/sudaderablanca1.jpg'),

('Sudadera Jimin Tattoo', 'Prenda de vestir de colección.', 5, 'prenda', '0.7kg', 'Activo', 400.00, 'img/products/sudaderablanca2.jpg');

UPDATE producto
SET categoria =
CASE
    WHEN nombre IN ('Camisa Golden','Camisa Indigo') THEN 'camisa'
    WHEN nombre IN (
        'Suéter Navideño BTS',
        'Sudadera Jungkook Tattoo',
        'Sudadera Jimin Tattoo'
    ) THEN 'sueter'
    ELSE categoria
END;

update producto set categoria = 'taza' where id_producto = 11
update producto set categoria = 'termo' where id_producto = 7
update producto set categoria = 'frazada' where id_producto = 8

-- 1. Eliminar la restricción que "amarra" la columna (usa el nombre del error)
ALTER TABLE producto DROP CONSTRAINT DF__producto__activo__01142BA1;

-- 2. Ahora que ya no hay dependencia, eliminar la columna
ALTER TABLE producto DROP COLUMN activo;




select id_producto,nombre,precio_unitario,imagen from producto


-- tallas --
CREATE TABLE producto_talla (
    id_talla INT IDENTITY(1,1) PRIMARY KEY,
    id_producto INT NOT NULL,
    talla VARCHAR(5) NOT NULL,
    stock INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- *Ajusta la descripción, stock y categoría según necesites*

create table pedido(
id_pedido int primary key identity(1,1) not null,
id_cliente int,
fecha_pedido date,
estado_pedido varchar(20),
metodo_pago varchar(20),
total money,
 foreign key(id_cliente) references cliente(id_cliente)

)

alter table pedido add detalle_string_pedido varchar(255)

select * from pedido
delete from pedido


--insert into pedido(id_cliente,estado_pedido) values(1,'detenido')

truncate table pedido

create table detalle_pedido(
id_pedido int,
id_producto int,
id_cliente int,
cantidad int,
precio_unitario money,
subtotal money

foreign key (id_pedido) references pedido(id_pedido),
foreign key (id_cliente) references cliente(id_cliente),
foreign key (id_producto) references producto(id_producto) 




)

select pedido.id_pedido,pedido.id_cliente,fecha_pedido,estado_pedido,total,detalle_string_pedido,detalle_pedido.id_producto,cantidad,imagen,detalle_pedido.precio_unitario,envio.direccion_envio from pedido
INNER JOIN detalle_pedido ON pedido.id_pedido = detalle_pedido.id_pedido  INNER JOIN producto ON
detalle_pedido.id_producto = producto.id_producto
INNER JOIN envio ON envio.id_pedido = pedido.id_pedido

where pedido.id_pedido = 2019

select * from detalle_pedido
delete from detalle_pedido


create table envio(
id_envio int primary key identity(1,1) not null,
id_pedido int,
direccion_envio char(40),
empresa_envio char(20),
costo_envio money,
numero_guia varchar(30),
fecha_envio date,
fecha_entrega date,
estado_envio varchar(30)
foreign key (id_pedido) references pedido(id_pedido)

)

select * from envio
delete from envio

SELECT SUM(total) AS MontoMes FROM pedido 
                        WHERE MONTH(fecha_pedido) = MONTH(GETDATE()) 
                        AND YEAR(fecha_pedido) = YEAR(GETDATE())

						 -- Selecciona los 5 días de envío más recientes, contando los pedidos de cada día.
        -- Se usa fecha_envio porque es la que se inserta en el momento de procesar el pedido.
        SELECT TOP 5 
            CONVERT(VARCHAR(10), fecha_envio, 120) AS FechaBase, 
            COUNT(id_envio) AS Cantidad
        FROM envio
        -- Solo incluye registros que tienen una fecha de envío.
        WHERE fecha_envio IS NOT NULL
        GROUP BY fecha_envio
        -- Muestra los más recientes primero.
        ORDER BY fecha_envio DESC

sELECT TOP 5
            p.id_pedido,
            CONVERT(VARCHAR(10), p.fecha_pedido, 120) AS FechaPedido,
            p.total,
            p.estado_pedido,
            c.nombre AS NombreCliente
        FROM pedido p
        JOIN cliente c ON p.id_cliente = c.id_cliente
        ORDER BY p.fecha_pedido DESC

CREATE TABLE solicitud_personalizacion (
    id_solicitud INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    tipo_producto VARCHAR(50) NOT NULL,
    instrucciones TEXT,
    imagen_url VARCHAR(250),
    fecha_solicitud DATETIME DEFAULT GETDATE(),
    estado VARCHAR(20) DEFAULT 'Pendiente' -- (Pendiente, Revisado, Aprobado)
);
ALTER TABLE solicitud_personalizacion
ADD imagen_nombre VARCHAR(150);
select * from solicitud_personalizacion

alter table solicitud_personalizacion
drop column imagen_url

alter table solicitud_personalizacion
add json_disenio NVARCHAR(max)

ALTER TABLE solicitud_personalizacion
ADD id_cliente INT;

ALTER TABLE solicitud_personalizacion
ADD CONSTRAINT FK_solicitud_cliente
FOREIGN KEY (id_cliente)
REFERENCES cliente(id_cliente);

select envio.id_pedido,fecha_envio,SUM(subtotal) as suma_total,estado_envio
from envio INNER JOIN detalle_pedido ON
detalle_pedido.id_pedido = envio.id_pedido
where id_cliente = @id_cliente
group by envio.id_pedido, envio.fecha_envio,
   envio.estado_envio;


            SELECT 
            id_solicitud,
            CONVERT(VARCHAR(10), fecha_solicitud, 120) AS fecha_solicitud,
            tipo_producto,
            instrucciones,
            solicitud_personalizacion.id_cliente,
            telefono,
            correo,
            estado

        FROM solicitud_personalizacion INNER JOIN cliente ON
        solicitud_personalizacion.id_cliente = cliente.id_cliente
        ORDER BY fecha_solicitud DESC


        SELECT TOP 10
            p.id_pedido,
            c.nombre AS cliente,
            CONVERT(VARCHAR(10), p.fecha_pedido, 120) AS fecha_pedido,
            p.total,
            p.estado_pedido,
            d.cantidad,
            (select nombre from producto INNER JOIN detalle_pedido 
            ON producto.id_producto = detalle_pedido.id_producto
            where detalle_pedido.id_pedido = p.id_pedido) as nombre_producto

            
        FROM pedido p
        INNER JOIN cliente c ON p.id_cliente = c.id_cliente
        INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
        ORDER BY p.fecha_pedido DESC


        SELECT TOP 10
    p.id_pedido,
    cliente.nombre AS cliente,
    CONVERT(VARCHAR(10), p.fecha_pedido, 120) AS fecha_pedido,
    p.total,
    p.estado_pedido,
    detalle_pedido.cantidad,
    producto.nombre AS nombre_producto

FROM pedido p
INNER JOIN cliente  ON p.id_cliente = cliente.id_cliente
INNER JOIN detalle_pedido  ON detalle_pedido.id_pedido = p.id_pedido
INNER JOIN producto  ON producto.id_producto = detalle_pedido.id_producto

ORDER BY p.fecha_pedido DESC;

select envio.id_pedido,fecha_envio,SUM(subtotal) as suma_total,estado_pedido
    from envio INNER JOIN detalle_pedido ON
    detalle_pedido.id_pedido = envio.id_pedido
    INNER JOIN pedido ON pedido.id_pedido = envio.id_pedido
    group by envio.id_pedido, envio.fecha_envio,
    pedido.estado_pedido;

    CREATE TABLE gestion_pedidos_borrados (
    id_gestion INT IDENTITY(1,1) PRIMARY KEY,
    id_pedido INT,
    id_cliente INT,
    fecha_pedido DATETIME,
    total DECIMAL(10,2),
    metodo_pago VARCHAR(50),
    fecha_eliminacion DATETIME DEFAULT GETDATE(),
    motivo_gestion VARCHAR(255) DEFAULT 'Eliminación por administrador'
);

CREATE TRIGGER trg_HistorialGestionPedidos
ON pedido
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO gestion_pedidos_borrados (id_pedido, id_cliente, fecha_pedido, total, metodo_pago)
    SELECT id_pedido, id_cliente, fecha_pedido, total, metodo_pago
    FROM deleted; -- "deleted" es una tabla temporal de SQL Server con los datos borrados
END;

select * from gestion_pedidos_borrados
select id_pedido,pedido.id_cliente,fecha_pedido, total, estado_pedido,detalle_string_pedido,correo from pedido
INNER JOIN cliente ON pedido.id_cliente = cliente.id_cliente