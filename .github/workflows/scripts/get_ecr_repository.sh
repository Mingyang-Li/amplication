REPO_NAME=${GITHUB_REPOSITORY##*/}
echo "REPO_NAME: $REPO_NAME"
ECR_REPOSITORY_PREFIX="-dev"
if [ "$REPO_NAME" = "amplication" ]; then
    ECR_REPOSITORY_PREFIX="-dev"
else
    ECR_REPOSITORY_PREFIX="-prod" 
fi
ECR_REPOSITORY="${SERVICE_NAME}$ECR_REPOSITORY_PREFIX"
echo "ECR_REPOSITORY_PREFIX: $ECR_REPOSITORY_PREFIX"
echo "ECR_REPOSITORY: $ECR_REPOSITORY"
echo "ECR_REPOSITORY=$ECR_REPOSITORY" >> $GITHUB_ENV