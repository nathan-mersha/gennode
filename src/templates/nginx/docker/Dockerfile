FROM nginx

MAINTAINER __author__

# adding custom nginx config file
ADD nginx.conf /etc/nginx

# exposing port
EXPOSE 80 443

# default command
CMD ["nginx", "-g", "daemon off;"]