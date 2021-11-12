# Getting Started with **Two Weeks Ready**

## Overview

This document is intended to provide contributors a technical overview of the *Two Weeks Ready System*. 

## Architecture

The system consists of three major modules/components/services: 
1. **App** - a PWA(Progessive Web Application) that a typical end-user would interact with the system.
1. **Admin Portal** - A web portal to be used by the system administrator to configure and monitor the system.
1. **API Services** - A Web api that provides the underlying mechanism for persisting information on the system and is called by the **App** and **Admin Portal**.

More detailed information on these modules/services are below. 

Other 3rd Party Services on which these modules/services are directly or indirectly dependent on:

* **Auth0** for _Authentication and Authorization_
* Azure Blob Storage
* Cosmos DB

The system is designed to be deployed to Azure using a CI/CD pipeline from GitHub.

## App

This application is the primary interface used by end-users.   
* Implemented as a PWA(Progressive Web Application) to allow it to function offline.
* A Vue application
* Connects to the API Service
* Secured with Auth0
* hosted statically hosted in Azure

## Admin Portal

This is a web portal used by administrators to configure and monitor the system. It is a Blazor Server application hosted in a Azure App Service.

## API Service

This is the back-end of the system. It is implemented in Azure Functions.
* secured with Auth0
* persists data in Azure Blob Storage
* persists data in Cosmos DB

## Repository Layout

- this section should describe the top level folder
