set -e

if [ "$1" != '' ]
then 
    git add .

    git commit -m $1

    git push

    git push heroku main
fi

cd -