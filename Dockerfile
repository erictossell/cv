FROM etossell/homepage-nix:latest

# Set the working directory in the container to /app
WORKDIR /static

# Copy the current directory contents into the container at /app
COPY ./static /static

# Make port 8000 available to the world outside this container
EXPOSE 5000

#CMD ["homepage-nix" "--port" "8081" "--static-dir" "/static"]

