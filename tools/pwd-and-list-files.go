package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"log"
)

func main() {
	pwd, err := os.Getwd()
	errcheck(err)
	fmt.Printf("Current Directory: %s \n", pwd)
	
	files, err := ioutil.ReadDir(pwd)
	errcheck(err)
	
	for _, file := range files {
		fmt.Printf("%+v \n", file.Name())
	}	
	
}


func errcheck(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
