create table user(
  username VARCHAR(20) not null,
  password VARCHAR(20) not null,
  school VARCHAR(20) not null,
  name VARCHAR(20) default '',
  gender VARCHAR(4) default '',
  age int default 0,
  phone VARCHAR(11) default '',
  qq VARCHAR(20) default '',
  email VARCHAR(20) default '',
  primary key (username)
);

create table goods(
  G_ID int not null auto_increment,
  gname VARCHAR(20) not null,
  school VARCHAR(20) not null,
  category VARCHAR(20) not null,
  way VARCHAR(20) not null,
  ex_goods VARCHAR(20) default '',
  ex_price int default 0,
  description text not null,
  username VARCHAR(20) not null,
  primary key(G_ID),
  foreign key(username) references user(username)
);
select a.gname,a.category,a.ex_goods,a.ex_price,a.description,a.username,b.src from goods a inner join img b on a.G_ID = b.G_ID group by a.gname,a.category,a.ex_goods,a.ex_price,a.description,a.username,b.src;
create table img(
  IMG_ID int not null auto_increment,
  src VARCHAR(200) not null,
  G_ID int not null,
  primary key (IMG_ID),
  foreign key(G_ID) references goods(G_ID)
);


GRANT all ON se_DB.* TO 'se'@'localhost';
