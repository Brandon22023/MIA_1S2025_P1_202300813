package main

import (
	"bufio"
	"fmt"
	"os"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	analyzer "terminal/analyzer"
)

func main() {
	// Crea una nueva instancia de Fiber
    app := fiber.New()

    // Habilita CORS
    app.Use(cors.New(cors.Config{
        AllowOrigins: "*",
        AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
    }))

    // Define una ruta POST para analizar comandos
    app.Post("/analyze", func(c *fiber.Ctx) error {
        // Obtiene el texto ingresado por el usuario desde el cuerpo de la solicitud
        input := string(c.Body())

        // Llama a la función Analyzer del paquete analyzer para analizar el comando ingresado
        cmd, err := analyzer.Analyzer(input)
        if err != nil {
            // Si hay un error al analizar el comando, devuelve un error
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                "error": err.Error(),
            })
        }

        // Devuelve el comando analizado como respuesta JSON
        return c.JSON(fiber.Map{
            "command": cmd,
        })
    })

    // Inicia el servidor Fiber en el puerto 3000
    go func() {
        if err := app.Listen(":3000"); err != nil {
            fmt.Println("Error al iniciar el servidor Fiber:", err)
        }
    }()






	// Crea un nuevo escáner que lee desde la entrada estándar (teclado)
	scanner := bufio.NewScanner(os.Stdin)

	// Bucle infinito para leer comandos del usuario
	for {
		fmt.Print(">>> ") // Imprime el prompt para el usuario

		// Lee la siguiente línea de entrada del usuario
		if !scanner.Scan() {
			break // Si no hay más líneas para leer, rompe el bucle
		}

		// Obtiene el texto ingresado por el usuario
		input := scanner.Text()

		// Llama a la función Analyzer del paquete analyzer para analizar el comando ingresado
		cmd, err := analyzer.Analyzer(input)
		if err != nil {
			// Si hay un error al analizar el comando, imprime el error y continúa con el siguiente comando
			fmt.Println("Error:", err)
			continue
		}

		// Comentado: Aquí podrías imprimir el comrando analizado
		fmt.Printf("Parsed Command: %+v\n", cmd)
	}

	// Verifica si hubo algún error al leer la entrada
	if err := scanner.Err(); err != nil {
		// Si hubo un error al leer la entrada, lo imprime
		fmt.Println("Error al leer:", err)
	}
}
