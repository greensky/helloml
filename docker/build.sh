perl -p -i -e "s/(.--no-cache:).*/\1 $RANDOM/" Dockerfile.cpu && 
docker build --build-arg REPO=https://github.com/gregorypierce/helloml.git --build-arg TAG=main --tag helloml/tensorflow:tensorflow2.3.1-py3.8.3 -f Dockerfile.cpu .
