function reloadprod {
  ssh root@pccloud 'cd ~/nyc-subway-sign ; docker-compose pull ; docker-compose down ; docker-compose up -d'
}

function push {
  docker build --platform linux/amd64 --no-cache --tag=nyc-subway-sign . 
  docker tag nyc-subway-sign pricecomstock/nyc-subway-sign
  docker push pricecomstock/nyc-subway-sign:latest
}

function testcontainer {
  docker run --name nyc-subway-sign-test --env-file .env -p 5000:80 nyc-subway-sign > /dev/null &
  echo "Do you still wish to deploy? This will rebuild the container for x64"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) push; break;;
          No ) break;;
      esac
  done
  docker kill nyc-subway-sign-test | xargs echo "killing"
  docker rm nyc-subway-sign-test | xargs echo "removing"
}

docker build --no-cache --tag=nyc-subway-sign .
echo ""
echo "=============================="
echo ""
echo "Container built!"
echo "You can either launch a test container on port 5000, or throw caution to the wind and just push to DockerHub"
echo "Please choose next step:"
select next in "Test" "Push" "Nothing"; do
  case $next in
    Test ) testcontainer; break;;
    Push ) push; break;;
    Nothing ) break;;
  esac
done

echo "Refresh prod?"
select next in "Refresh" "No"; do
  case $next in
    Refresh ) reloadprod; break;;
    No ) break;;
  esac
done