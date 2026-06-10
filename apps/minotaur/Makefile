STAGE ?= dev
NAME ?= minotaur
TAG   ?= latest

LOCAL_ENV := .env.local
ifneq (,$(wildcard $(LOCAL_ENV)))
    include $(abspath $(LOCAL_ENV))
endif

ifneq ($(ENV_FILES),)
    include $(firstword $(ENV_FILES))
endif

export

REGISTRY        := $(REGISTRY_HOST)
FULL_IMAGE_NAME := $(REGISTRY)/$(STAGE)/$(NAME):$(TAG)

.PHONY: all build

CACHEBUST := $(shell bun -e "console.log(Date.now())")

build:
	docker buildx build \
	--push \
	--platform linux/amd64 \
	--secret id=INFISICAL_ID,env=INFISICAL_CLIENT_ID \
	--secret id=INFISICAL_SECRET,env=INFISICAL_CLIENT_SECRET \
	--secret id=INFISICAL_PROJECT_ID,env=INFISICAL_PROJECT_ID \
	--secret id=INFISICAL_API_URL,env=INFISICAL_API_URL \
	--build-arg STAGE=$(STAGE) \
	--build-arg CACHEBUST=$(CACHEBUST) \
	-t $(FULL_IMAGE_NAME) \
	-f $(abspath Dockerfile) $(abspath ../..)
