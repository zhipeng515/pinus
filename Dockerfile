FROM node:8-alpine
RUN mkdir /home/pinus
ADD . /home/pinus/
WORKDIR /home/pinus
RUN yarn

