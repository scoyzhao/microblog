# microblog
A microblog demo based on NodeJS

重构了一下《nodejs开发指南》里博客的例子，使用了express4+mongoose,模板使用了handlebars，并且用passport做登录认证，实现了书本上的功能。
还有一些小bug，比如发言长度过长会影响显示效果，这些可以在view相应的页面里加限制。。

2017.05.22  
发现一个小bug，登录的时候如果密码输错啦，会返回no user，可能是没有用connect-flash，用的那个有点混乱。。。不知道怎么改了，有兴趣的可以修改成flash（工作量有点大，懒得改了。。。。）

