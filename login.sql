USE sistema_login;

DROP TABLE usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (email, senha)
VALUES
('aluno@gmail.com', '123456'),
('prof@gmail.com', '123456');

SELECT * FROM usuarios;