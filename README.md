# Code-Gen CG
Generate code from Pseudo code

Most of the times we write the same code we wrote some time back in the same programming language, the idea is to generate actual code from the pseudo code. 

## API Documentation

### API - /cgservices/createNewFile POST

Description - This API creates a new file in the given directory with given filecontent and executes the code synchronously and gives the response.

Request form data

filename = File name to be created

directory = Directory in which the new File need to be created

filecontent = Code need to be saved and Executed in the file


### API - /cgservices/executeFile GET

Description - This API executes the code in given file asynchronously and gives back process id, which we can send to get the actual response.

Request Query Parameters

filePath = Absoulte path of file

Response

{ pid: < process id to check response > }


### API - /cgservices/getResponse GET

Description - This API gets back the response of files which ran asynchronously.

Request Query Parameters

pid = process id to get the response.

Response

{ response: < file execution response >, status: < status of code execution > }

