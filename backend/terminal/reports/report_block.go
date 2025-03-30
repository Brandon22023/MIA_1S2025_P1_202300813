package reports

import (
    "fmt"
    "os"
    "os/exec"
    "terminal/structures"
	"strings"
)

// ReportBlockDot genera un reporte de los bloques de carpeta en formato DOT y lo convierte en una imagen PNG
func ReportBlockDot(diskPath string, superblock *structures.SuperBlock, outputDotPath string, outputPngPath string) error {
    // Crear el archivo .dot
    dotFile, err := os.Create(outputDotPath)
    if err != nil {
        return fmt.Errorf("error al crear el archivo .dot: %v", err)
    }
    defer dotFile.Close()

    // Escribir el encabezado del archivo DOT
    _, err = dotFile.WriteString("digraph G {\n")
    if err != nil {
        return fmt.Errorf("error al escribir en el archivo .dot: %v", err)
    }

    // Iterar sobre los inodos
    for i := int32(0); i < superblock.S_inodes_count; i++ {
        inode := &structures.Inode{}
        // Deserializar el inodo
        err := inode.Deserialize(diskPath, int64(superblock.S_inode_start+(i*superblock.S_inode_size)))
        if err != nil {
            return fmt.Errorf("error al deserializar el inodo en la posición %d: %v", i, err)
        }

        // Iterar sobre los bloques del inodo
        for _, blockIndex := range inode.I_block {
            // Si el bloque no existe, salir
            if blockIndex == -1 {
                break
            }

            // Si el inodo es de tipo carpeta
            if inode.I_type[0] == '0' {
                block := &structures.FolderBlock{}
                // Deserializar el bloque
                err := block.Deserialize(diskPath, int64(superblock.S_block_start+(blockIndex*superblock.S_block_size)))
                if err != nil {
                    return fmt.Errorf("error al deserializar el bloque en la posición %d: %v", blockIndex, err)
                }

                // Escribir el nodo del bloque en el archivo DOT
                _, err = dotFile.WriteString(fmt.Sprintf("  Block%d [label=\"Bloque %d\"];\n", blockIndex, blockIndex))
                if err != nil {
                    return fmt.Errorf("error al escribir en el archivo .dot: %v", err)
                }

                // Escribir las entradas del bloque
                for _, content := range block.B_content {
                    name := string(content.B_name[:])
                    name = trimNullBytes(name) // Eliminar bytes nulos del nombre
                    if content.B_inodo != 0 {
                        _, err = dotFile.WriteString(fmt.Sprintf("  Block%d -> Inode%d [label=\"%s\"];\n", blockIndex, content.B_inodo, name))
                        if err != nil {
                            return fmt.Errorf("error al escribir en el archivo .dot: %v", err)
                        }
                    }
                }
            }
        }
    }

    // Escribir el cierre del archivo DOT
    _, err = dotFile.WriteString("}\n")
    if err != nil {
        return fmt.Errorf("error al escribir en el archivo .dot: %v", err)
    }

    // Ejecutar Graphviz para generar la imagen PNG
    cmd := exec.Command("dot", "-Tpng", outputDotPath, "-o", outputPngPath)
    err = cmd.Run()
    if err != nil {
        return fmt.Errorf("error al ejecutar Graphviz: %v", err)
    }

    fmt.Printf("Reporte DOT generado exitosamente en: %s\n", outputDotPath)
    fmt.Printf("Imagen PNG generada exitosamente en: %s\n", outputPngPath)
    return nil
}

// trimNullBytes elimina los bytes nulos (\x00) de una cadena
func trimNullBytes(input string) string {
    return strings.TrimRight(input, "\x00")
}