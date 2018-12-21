CREATE USER IF NOT EXISTS 'babelfish'@'localhost' IDENTIFIED BY 'Fish42';
GRANT EXECUTE, INSERT, SELECT, UPDATE, DELETE ON babelfish.* TO 'babelfish'@'localhost';
FLUSH PRIVILEGES;

DROP DATABASE IF EXISTS babelfish;
CREATE SCHEMA babelfish;
USE babelfish;

CREATE TABLE User (
    user_id INTEGER AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    biography VARCHAR(500) DEFAULT '',
    picture_url VARCHAR(500) DEFAULT '',
    PRIMARY KEY(user_id),
    CONSTRAINT unique_fields UNIQUE (username, email)
);

CREATE TABLE Language (
    language_id INTEGER AUTO_INCREMENT,
    language_name VARCHAR(50) NOT NULL,
    PRIMARY KEY(language_id)
);

CREATE TABLE Spoken_Languages (
    user_id INTEGER NOT NULL,
    language_id INTEGER NOT NULL,
    PRIMARY KEY(user_id, language_id),
    FOREIGN KEY(user_id) REFERENCES User(user_id),
    FOREIGN KEY(language_id) REFERENCES Language(language_id)
);

CREATE TABLE Chat (
    chat_id INTEGER AUTO_INCREMENT,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    PRIMARY KEY(chat_id),
    FOREIGN KEY(user1_id) REFERENCES User(user_id),
    FOREIGN KEY(user2_id) REFERENCES User(user_id),
    CONSTRAINT unique_chat UNIQUE (user1_id,user2_id)
);

CREATE TABLE Message (
    message_id INTEGER AUTO_INCREMENT,
    chat_id INTEGER NOT NULL,
    message_sender_id VARCHAR(50) NOT NULL,
    message_content VARCHAR(500) NOT NULL,
    message_read TINYINT(1) DEFAULT 0 NOT NULL,
    message_time VARCHAR(10) NOT NULL,
    PRIMARY KEY(message_id, chat_id),
    FOREIGN KEY(chat_id) REFERENCES Chat(chat_id)
);

DELIMITER //
CREATE PROCEDURE Register_User (IN username_p VARCHAR(50), IN password_p VARCHAR(255), IN salt_p VARCHAR(255), IN first_name_p VARCHAR(50), IN last_name_p VARCHAR(50), IN email_p VARCHAR(50))
BEGIN
    INSERT INTO User(username, password, salt, first_name, last_name, email) VALUES (username_p, password_p, salt_p, first_name_p, last_name_p, email_p);
END //

CREATE PROCEDURE Get_User_Profile (IN username_p VARCHAR(50))
BEGIN
    SELECT user_id, username, first_name, last_name, email, biography, picture_url FROM User WHERE username = username_p;
END //

CREATE PROCEDURE Get_Salt (IN username_p VARCHAR(50))
BEGIN
    SELECT salt FROM User WHERE username = username_p;
END //

CREATE PROCEDURE Get_Password (IN username_p VARCHAR(50))
BEGIN
    SELECT password FROM User WHERE username = username_p;
END //

CREATE PROCEDURE Get_Spoken_Languages (IN username_p VARCHAR(50))
BEGIN
    SELECT l.language_name
    FROM Language l
    INNER JOIN Spoken_Languages s ON l.language_id = s.language_id
    INNER JOIN User u ON u.user_id = s.user_id
    WHERE u.username = username_p;
END //

CREATE PROCEDURE Update_Profile (IN username_p VARCHAR(50), IN first_name_p VARCHAR(50), IN last_name_p VARCHAR(50), IN email_p VARCHAR(50), IN biography_p VARCHAR(500), IN picture_url_p VARCHAR(500))
BEGIN
    UPDATE User
    SET first_name = first_name_p,
    last_name = last_name_p,
    email = email_p,
    biography = biography_p,
    picture_url = picture_url_p
    WHERE username = username_p;
END //

CREATE PROCEDURE Add_Language (IN username_p VARCHAR(50), IN language_name_p VARCHAR(50))
BEGIN
    INSERT IGNORE INTO Spoken_Languages VALUES (
        (SELECT user_id FROM User WHERE username = username_p),
        (SELECT language_id FROM Language WHERE language_name = language_name_p)
    );
END //

CREATE PROCEDURE Delete_Spoken_Languages (IN username_p VARCHAR(50))
BEGIN
    DELETE FROM Spoken_Languages WHERE user_id IN (
        SELECT user_id FROM User WHERE username = username_p
    );
END //

CREATE PROCEDURE Get_Profiles_By_Language (IN language_name_p VARCHAR(50), IN page_p INTEGER)
BEGIN
    SELECT u.username, u.first_name, u.last_name, u.picture_url
    FROM User u
    INNER JOIN Spoken_Languages s ON s.user_id = u.user_id
    INNER JOIN Language l ON l.language_id = s.language_id
    WHERE l.language_name = language_name_p
    LIMIT page_p, 10;
END //

CREATE PROCEDURE Get_Total_Profiles_By_Language (IN language_name_p VARCHAR(50))
BEGIN
    SELECT COUNT(DISTINCT s.user_id) as count
    FROM Spoken_Languages s
    INNER JOIN Language l ON l.language_id = s.language_id
    WHERE l.language_name = language_name_p;
END //

CREATE PROCEDURE Get_My_Chats(IN username_p VARCHAR(50))
BEGIN
    SELECT c.chat_id, c.user1_id, c.user2_id FROM Chat c
    INNER JOIN User u ON u.user_id = c.user1_id OR u.user_id = c.user2_id
    WHERE u.username = username_p;
END //

CREATE PROCEDURE Get_Chat_Messages (IN username_p VARCHAR(50), IN chat_id_p INTEGER)
BEGIN
    SELECT message_sender_id, message_content, message_time, message_read FROM Message
    WHERE chat_id = chat_id_p;
END //

CREATE PROCEDURE Create_Chat (IN username1_p VARCHAR(50), IN username2_p VARCHAR(50))
BEGIN
    INSERT INTO Chat (user1_id, user2_id) VALUES (
        (SELECT user_id FROM User WHERE username = username1_p),
        (SELECT user_id FROM User WHERE username = username2_p)
    );
END //

CREATE PROCEDURE Send_Message(IN chat_id_p INTEGER, IN sender_username_p VARCHAR(50), IN message_content VARCHAR(500), IN message_time VARCHAR(10))
BEGIN
    INSERT INTO Message(chat_id, message_sender_id, message_content, message_time) VALUES (
        chat_id_p,
        (SELECT user_id FROM User WHERE username = sender_username_p),
        message_content,
        message_time
    );
END //

CREATE PROCEDURE Get_Basic_Info (IN user_id_p VARCHAR(50))
BEGIN
    SELECT username, first_name, last_name, picture_url FROM User WHERE user_id = user_id_p;
END //

DELIMITER ;

CALL Register_User('heavypeacock527',
'688e3ea883d7b524a9c1028a6d3ce2ac32e7772ca93cdcb6cdd661d1e29199056b691d932d922ef48a88584d6d10ff82f3ea2a551f81b25cdd810f3bd62784eb',
'a2da7d881235e3d545c9508b7b58504a2500158f66a2f8337e4402c284e1faefb5d08b25e4795e8200ff1a4ea5651d6733d46803433fec3bf2b2a752577f8ab0',
'Jonas',
'Norman',
'jonas.norman@example.com');

CALL Register_User('lazydog359',
'b954d38d283c1cdbac65ccb9ffe2e2650713d43f3b41914c7bafd197890ee4882259fc8bd32c387da00f523b69a82a917e124c05e62d1b5477d7fd68d1ebc55a',
'941288f84ca8eb0722b635de30a33ed8ddef4ad5470c31cb200910e7c9fdc1c0bf90cfcf5bbb4b3264bcd3a408aca852fac7dffd3c94a6b448b825c7a1a13fef',
'Thomas',
'Fortin',
'thomas.fortin@example.com');

CALL Register_User('bigleopard960',
'd022e3f4e62635434b15c5927eea81620a00aeaa0294023cf7ac55e3cc5af3177a384df290e385117a18d84420e70ad9577facade0300922eb8c05de152e3651',
'2b978ac4ec74add29feabc3beccba3eb46077fbc6bfafffe39e2d765adb715cb26444017110e7c24cf55fa933d93f01acf1021dab0743ea357887e629a43f1f4',
'Hassan',
'Bendel',
'hassan.bendel@example.com');

CALL Register_User('bluebear886',
'2b26c3aedb46fb356e9fd92cfb1741160a1c61d2dd1d16a6be418cd76a82a36fcc532be9ebb7faa84c047722fba43854d1caf70b339ac5892e3c321657293c10',
'423583c0841e0170723c79cb1c7257895ca8a129ba187984c4dc4f56758bfc5f865afb8096eed35fb0d6ebb2490e6724baf372b239bab21d8b71b69aa8f5d8cc',
'Caroline',
'Niemann',
'caroline.niemann@example.com');

CALL Register_User('beautifulfrog446',
'0be750e6d528a446344a2ba10f36b6efa6371538712c0ca770048cea822fd6eb1531f31e1d403cccfb25560555fc358de7302316882c2d2348ec553ed9aa17db',
'8c6a9c2b7b7d062e66daace002885bd18a909b250df54de4342c113144b56e03d781a3659f5cfebcbed32e1eb27d2ae77693df66d0bec9f4c6dfe34637db30b0',
'Felipe',
'Gallardo',
'felipe.gallardo@example.com');

CALL Register_User('crazymeercat505',
'04acab6fba184d35f29e3d30d8d6ab5a2e2fed09122b9029ee86da40719b0aefd8fb387f159df031c8bf4af7e9d83a71c6f16334fcedcf8f237e99d2961ecd3b',
'81eb528c347e6dac2fb2670c119445659fa7ce32e89e2013959c011af24e3c4963adc99672f381e6bb6932ab084aab48ae2c9dc7769200bf480dad0b54fa7d4d',
'Madison',
'Bennett',
'madison.bennett@example.com');

CALL Register_User('greenzebra894',
'dd08a9bc90f7ce7465b59ba4c978ed0e137e701f3937ef4f34993040b5fbc243655e06d0aee9821d2ce9b41917dc99f603b61420104da446ce9b2da87454cd69',
'7389d93be673de18ec6d9fbc00f11c434388d3bd81ac359800bfb44fcbe83117beef1e5255b1a85cfc358b9fafa96312c1090f53ee58f5964e3d72e934b7ffca',
'Carrie',
'Jenkins',
'carrie.jenkins@example.com');

CALL Register_User('ticklishduck942',
'30feb55a1da44ab5300c84d62f864374f2dff8aa9dae60bf8f7b2fe7ecacc252ed66b0c14a495962178af35801a6f80028f48bcbe32b5c549b4ffa3bc7c9bf7b',
'4fe102d75454e2722550a8e460a809ef70366fd8a13e6275fe6c78cbadb9b5dba2f826d4bfc7b1d0435d654cff7a1dde83fb4705c44be22d939b069b83081b2b',
'Freja',
'Olsen',
'freja.olsen@example.com');

CALL Register_User('blackbutterfly711',
'b635958533384c091814f6ac640dd466ee9441c6c3081c30f0130acd2d6827b73a426454c1104883235bb770aa35101e93312f4e6533366a0276ea3ad050325e',
'15833501f8dc7aa6f95e78f8ca55bbd6de93a1bfb7dd65862ed6c84a714a3b376d2cf98900f4033c621576a14ea1bca67efe0844761f5671f186a5451f63dc34',
'Sunny',
'Dart',
'sunny.dart@example.com');

CALL Register_User('redgoose802',
'ab2e061c0cd3da0aede24d30f7da9a7c2732e1552fe14dbc28afe31b52d7b5982d7178517de878a05b511669cdb4934e8e8aca359a74d4774f486e5e71ffc81f',
'93707f84723f15aee3357ad6f35615e9a19e79b212b0f973f1362005d205d2700bfaf8b2a22023ed4fe828c75402646ec6292faee88398efe3273cd45f4da6d1',
'Brooke',
'Wilson',
'brooke.wilson@example.com');

INSERT INTO Language(language_name) VALUES('Akan');
INSERT INTO Language(language_name) VALUES('Amharic');
INSERT INTO Language(language_name) VALUES('Arabic');
INSERT INTO Language(language_name) VALUES('Assamese');
INSERT INTO Language(language_name) VALUES('Awadhi');
INSERT INTO Language(language_name) VALUES('Azerbaijani');
INSERT INTO Language(language_name) VALUES('Balochi');
INSERT INTO Language(language_name) VALUES('Belarusian');
INSERT INTO Language(language_name) VALUES('Bengali');
INSERT INTO Language(language_name) VALUES('Bhojpuri');
INSERT INTO Language(language_name) VALUES('Burmese');
INSERT INTO Language(language_name) VALUES('Cebuano');
INSERT INTO Language(language_name) VALUES('Chewa');
INSERT INTO Language(language_name) VALUES('Chhattisgarhi');
INSERT INTO Language(language_name) VALUES('Chittagonian');
INSERT INTO Language(language_name) VALUES('Creole');
INSERT INTO Language(language_name) VALUES('Czech');
INSERT INTO Language(language_name) VALUES('Deccan');
INSERT INTO Language(language_name) VALUES('Dhundhari');
INSERT INTO Language(language_name) VALUES('Dutch');
INSERT INTO Language(language_name) VALUES('English');
INSERT INTO Language(language_name) VALUES('French');
INSERT INTO Language(language_name) VALUES('Fula');
INSERT INTO Language(language_name) VALUES('German');
INSERT INTO Language(language_name) VALUES('Greek');
INSERT INTO Language(language_name) VALUES('Gujarati');
INSERT INTO Language(language_name) VALUES('Hakka');
INSERT INTO Language(language_name) VALUES('Haryanvi');
INSERT INTO Language(language_name) VALUES('Hausa');
INSERT INTO Language(language_name) VALUES('Hindi');
INSERT INTO Language(language_name) VALUES('Hmong');
INSERT INTO Language(language_name) VALUES('Hungarian');
INSERT INTO Language(language_name) VALUES('Igbo');
INSERT INTO Language(language_name) VALUES('Ilocano');
INSERT INTO Language(language_name) VALUES('Italian');
INSERT INTO Language(language_name) VALUES('Japanese');
INSERT INTO Language(language_name) VALUES('Javanese');
INSERT INTO Language(language_name) VALUES('Jin');
INSERT INTO Language(language_name) VALUES('Kannada');
INSERT INTO Language(language_name) VALUES('Kazakh');
INSERT INTO Language(language_name) VALUES('Khmer');
INSERT INTO Language(language_name) VALUES('Kinyarwanda');
INSERT INTO Language(language_name) VALUES('Kirundi');
INSERT INTO Language(language_name) VALUES('Konkani');
INSERT INTO Language(language_name) VALUES('Korean');
INSERT INTO Language(language_name) VALUES('Kurdish');
INSERT INTO Language(language_name) VALUES('Madurese');
INSERT INTO Language(language_name) VALUES('Magahi');
INSERT INTO Language(language_name) VALUES('Maithili');
INSERT INTO Language(language_name) VALUES('Malagasy');
INSERT INTO Language(language_name) VALUES('Malay');
INSERT INTO Language(language_name) VALUES('Malayalam');
INSERT INTO Language(language_name) VALUES('Mandarin');
INSERT INTO Language(language_name) VALUES('Marathi');
INSERT INTO Language(language_name) VALUES('Marwari');
INSERT INTO Language(language_name) VALUES('Min');
INSERT INTO Language(language_name) VALUES('Mossi');
INSERT INTO Language(language_name) VALUES('Nepali');
INSERT INTO Language(language_name) VALUES('Odia');
INSERT INTO Language(language_name) VALUES('Oromo');
INSERT INTO Language(language_name) VALUES('Pashto');
INSERT INTO Language(language_name) VALUES('Persian');
INSERT INTO Language(language_name) VALUES('Polish');
INSERT INTO Language(language_name) VALUES('Portuguese');
INSERT INTO Language(language_name) VALUES('Punjabi');
INSERT INTO Language(language_name) VALUES('Quechua');
INSERT INTO Language(language_name) VALUES('Romanian');
INSERT INTO Language(language_name) VALUES('Russian');
INSERT INTO Language(language_name) VALUES('Saraiki');
INSERT INTO Language(language_name) VALUES('SerboCroatian');
INSERT INTO Language(language_name) VALUES('Shanghainese');
INSERT INTO Language(language_name) VALUES('Shona');
INSERT INTO Language(language_name) VALUES('Sindhi');
INSERT INTO Language(language_name) VALUES('Sinhalese');
INSERT INTO Language(language_name) VALUES('Somali');
INSERT INTO Language(language_name) VALUES('Spanish');
INSERT INTO Language(language_name) VALUES('Sundanese');
INSERT INTO Language(language_name) VALUES('Swedish');
INSERT INTO Language(language_name) VALUES('Sylheti');
INSERT INTO Language(language_name) VALUES('Tagalog');
INSERT INTO Language(language_name) VALUES('Tamil');
INSERT INTO Language(language_name) VALUES('Telugu');
INSERT INTO Language(language_name) VALUES('Thai');
INSERT INTO Language(language_name) VALUES('Turkish');
INSERT INTO Language(language_name) VALUES('Turkmen');
INSERT INTO Language(language_name) VALUES('Ukrainian');
INSERT INTO Language(language_name) VALUES('Urdu');
INSERT INTO Language(language_name) VALUES('Uyghur');
INSERT INTO Language(language_name) VALUES('Uzbek');
INSERT INTO Language(language_name) VALUES('Vietnamese');
INSERT INTO Language(language_name) VALUES('Visayan');
INSERT INTO Language(language_name) VALUES('Xhosa');
INSERT INTO Language(language_name) VALUES('Xiang');
INSERT INTO Language(language_name) VALUES('Yoruba');
INSERT INTO Language(language_name) VALUES('Yue');
INSERT INTO Language(language_name) VALUES('Zhuang');
INSERT INTO Language(language_name) VALUES('Zulu');

INSERT INTO Spoken_Languages(user_id, language_id) VALUES(1, 1);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(2, 2);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(3, 3);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(4, 4);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(5, 5);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(6, 6);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(7, 7);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(8, 8);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(9, 9);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(1, 21);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(2, 21);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(3, 21);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(4, 21);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(5, 21);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(6, 21);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(7, 21);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(8, 21);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(9, 21);
INSERT INTO Spoken_Languages(user_id, language_id) VALUES(10, 21);