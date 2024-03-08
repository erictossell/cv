FROM etossell/homepage-nix:latest

WORKDIR /static

COPY ./static /static

EXPOSE 5000
