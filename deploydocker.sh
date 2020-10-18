function push {
  docker tag nyc-subway-sign pricecomstock/nyc-subway-sign
  docker push pricecomstock/nyc-subway-sign:latest
}

function testcontainer {
  docker run -p 5000:80 nyc-subway-sign > /dev/null &
  echo "Do you still wish to deploy?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) push; break;;
          No ) break;;
      esac
  done
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