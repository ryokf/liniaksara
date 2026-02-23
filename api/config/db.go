package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB(){
	errEnv := godotenv.Load()
	if errEnv != nil{
		log.Fatal("Failde to load .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPass, dbHost, dbPort, dbName)

	database, errDB := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if errDB != nil {
		log.Fatal("Database failed to connect : ", errDB)
	}

	DB = database

	log.Println("Database berhasil terhubung")

}