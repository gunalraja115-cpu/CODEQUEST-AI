@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements. See the NOTICE file
@REM for additional information regarding copyright ownership.
@REM
@REM Maven Wrapper script for Windows
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~n0)
@SET DP0=%~dp0

@IF "%MVNW_REPOURL%"=="" (SET MVNW_REPOURL=https://repo.maven.apache.org/maven2)

@SET _WRAPPER_DIR=%DP0%.mvn\wrapper\
@SET _WRAPPER_JAR="%_WRAPPER_DIR%maven-wrapper.jar"
@SET _WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@IF EXIST %_WRAPPER_JAR% (
    "%JAVA_HOME%\bin\java.exe" %MAVEN_OPTS% %MAVEN_DEBUG_OPTS% -cp %_WRAPPER_JAR% %_WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
) ELSE (
    @ECHO ERROR: Maven wrapper jar not found. Please run the wrapper goal from your project root.
    @EXIT /B 1
)
