FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files and restore as distinct layers
COPY ["backend/backend.csproj", "backend/"]
COPY ["backend.Application/backend.Application.csproj", "backend.Application/"]
COPY ["backend.Infrastructure/backend.Infrastructure.csproj", "backend.Infrastructure/"]
COPY ["backend.Domain/backend.Domain.csproj", "backend.Domain/"]

RUN dotnet restore "./backend/backend.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/backend"
RUN dotnet build "./backend.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
