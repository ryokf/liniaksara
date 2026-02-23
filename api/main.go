package main

import (
	"fmt"
	"liniaksara-api/config"

	"github.com/gin-gonic/gin"
)

func main(){
	config.ConnectDB()
	
	app := gin.Default()

	app.GET("/", func(c *gin.Context){
		c.String(200, "server is running")
	})

	fmt.Println("server is running")

	app.Run()
}