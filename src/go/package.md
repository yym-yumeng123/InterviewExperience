---
outline: deep
---

## fmt 包实现格式化 I/O.

- `Format` 如果一个操作数实现了 Formatter 接口，它将被调用。在这种情况下，动词和标志的解释由该实现控制, 优先级最高
- `GoStringer` GoString 方法用于打印作为操作数传递到%#v 格式的值
  - 如果 %v 谓词与#标志（%#v）一起使用，并且操作数实现了 GoStringer 接口，则将调用该接口
- `Error`
  - 如果一个操作数实现了错误接口，则将`调用 Error 方法将对象转换为字符串`，然后将根据动词（如果有的话）的要求格式化该字符串
- `Stringer` 优先级最低
  - 如果一个操作数实现了 String() string 方法，则该方法将被调用以将对象转换为字符串，然后将其格式化为动词（如果有的话）的要求

```go
type Person struct {
	Name string
	Age  int8
}

func (p Person) Error() string {
  return fmt.Sprintf("Error: Name: %s, Age: %d", p.Name, p.Age)
}


// String 控制默认输出 %v
func (p Person) String() string {
	// %v 输出 Name: yym, Age: 18
	return fmt.Sprintf("Name_我写的: %s, Age: %d", p.Name, p.Age)
}

// GoString 控制 %#v 的输出
func (p Person) GoString() string {
	return fmt.Sprintf("Person{Name: %q, Age: %d}", p.Name, p.Age)
}

// Format 实现自定义 格式化输出 %v %d %s 等
func (p Person) Format(f fmt.State, c rune) {
	switch c {
	case 'l':
		fmt.Fprint(f, strings.ToLower(p.Name))
	case 'u':
		fmt.Fprint(f, strings.ToUpper(p.Name))
	default:
		fmt.Fprintf(f, "Name: %s, Age: %d", p.Name, p.Age)
	}
}

func main() {
	p := Person{Name: "Alice", Age: 30}
	fmt.Printf("Person: %v\n", p)                  // Person: Name: Alice, Age: 30
	fmt.Printf("Person (lowercase name): %l\n", p) // Person (lowercase name): alice
	fmt.Printf("Person (uppercase name): %u\n", p) // Person (uppercase name): ALICE
	fmt.Printf("%#v\n", p)                         // Name: Alice, Age: 30
}
```

## 环境变量

- 环境变量是作为程序或操作系统运行环境的一部分的动态值，它们用于配置和定制软件的行为，并提供程序在运行时可以访问的信息。
- 环境变量通常是键值对，其中键是变量的名称，值是关联的数据。

```go
func main() {
	// 写
	os.Setenv("key", "value")
	// 读
	os.Getenv("key")
  os.Getenv("HOME") // 获取根目录
  os.Getenv("PWD") // 获取当前目录
}
```

```go
// 把环境变量的值序列化到 struct 中
import "github.com/caarlos0/env/v9"

type config struct {
	Home         string         `env:"HOME"`
	Port         int            `env:"PORT" envDefault:"3000"`
	Password     string         `env:"PASSWORD,unset"`
	IsProduction bool           `env:"PRODUCTION"`
	Duration     time.Duration  `env:"DURATION"`
	Hosts        []string       `env:"HOSTS" envSeparator:":"`
	TempFolder   string         `env:"TEMP_FOLDER,expand" envDefault:"${HOME}/tmp"`
	StringInts   map[string]int `env:"MAP_STRING_INT"`
}

func main() {
	cfg := config{}
	if err := env.Parse(&cfg); err != nil {
		fmt.Printf("%+v\n", err)
	}

	fmt.Printf("%+v\n", cfg)
}
```

## 文件读写

Linux 文件权限:

```md
-rwxr-xr-x => 755
当前用户/用户组/其他用户, 每个用户有三个字母代表权限

r: 可读 代表 4
w: 可写 代表 2
x: 可执行 代表 1

chomd 744 main 改变权限
```

游标的概念

文件存储内容以 `byte` 数据类型存储, 文件默认有一个游标, 每次读写, 游标从 0 开始移动 `file.Seek()`

### 读文件

- os.Open(path)
- os.OpenFile(path, "只读|只写|...", "权限")

`os.Open、os.Read`

```go
func main() {
	// 打开一个文件
	file, err := os.Open("path")
	if err != nil {
		panic(err)
	}

	// 读取文件内容
	buf := make([]byte, 1000)
	n, err := file.Read(buf)
	if err != nil {
		panic(err)
	}
	fmt.Println(n)               // 1000
	fmt.Println(string(buf[:n])) // 文件的内容只有 1000
}
```

循环读取

```go
func main() {
	// 打开一个文件
	file, err := os.Open("path")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	buf := make([]byte, 2014)
	// 循环读取文件内容
	for {
		n, err := file.Read(buf)
		if err != nil {
			if err == io.EOF {
				break
			}
			panic(err)
		}
		fmt.Println(n)
		fmt.Println(string(buf[:n]))
	}
}
```

`io.ReadAll`

```go
func main() {
	// 打开一个文件
	file, err := os.OpenFile("path", os)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	bytes, err := io.ReadAll(file)
	if err != nil {
		panic(err)
	}
	fmt.Printf(string(bytes))
}
```

`bufio.NewReader、bufio.ReadLine` 一行一行读

```go
func main() {
	file, err := os.Open("path")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	reader := bufio.NewReader(file)
	for {
		line, _, err := reader.ReadLine()
		if err != nil {
			if err == io.EOF {
				break
			}
			panic(err)
		}
		fmt.Println(string(line))
	}
}
```

### 写文件

`file.WriteString`

- `os.O_WRONLY|os.O_CREATE` 多次写入不会追加, 只会覆盖或者重写
- `os.O_APPEND` 可以追加到后面
- `os_TRUNC` 把文件清空, 在加数据

```go
func main() {
	// -rwx 4 2 0 =>  0644 -rw-
	file, err := os.OpenFile("example.txt", os.O_WRONLY|os.O_CREATE, 0644)
	file, err := os.OpenFile("example.txt", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	file, err := os.OpenFile("example.txt", os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	for i := 0; i < 200; i++ {
		_, err := file.WriteString(fmt.Sprintf("%d\n", i))
		if err != nil {
			panic(err)
		}
	}
}
```

`file.Seek()`

```go
func main() {
	file, err := os.OpenFile("example.txt", os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	for i := 0; i < 10; i++ {
		_, err := file.WriteString(fmt.Sprintf("-%d\n", i))
		if err != nil {
			panic(err)
		}
	}

	// 移动游标读取数据
	file.Seek(0, io.SeekStart)

	reader := bufio.NewReader(file)
	for {
		line, _, err := reader.ReadLine()
		if err != nil {
			if err == io.EOF {
				return
			}
			panic(err)
		}
		fmt.Println(string(line))
	}
}

// 使用 Seek 可以添加 和清空数据
func main() {
	file, err := os.OpenFile("example1.csv", os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		panic(err)
	}
	defer file.Close()

  // 游标end, 0处
	file.Seek(0, io.SeekEnd)

	for i := 0; i < 10; i++ {
		_, err := file.WriteString(fmt.Sprintf("-%d\n", i))
		if err != nil {
			panic(err)
		}
	}
}
```

### 读取目录

- `file.ReadDir(-1)`

```go
func main() {
	file, err := os.OpenFile("a", os.O_RDONLY, 0644)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	dirEntries, err := file.ReadDir(-1)
	if err != nil {
		panic(err)
	}

	for _, entry := range dirEntries {
		fileInfo, err := entry.Info()
		if err != nil {
			panic(err)
		}
		fmt.Printf("%v, %v, %v\n", entry.Name(), fileInfo.Size(), entry.IsDir())
	}
}
```

```go
// 递归检查目录
func printAllTxtFiles(dir string) error {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		filePath := filepath.Join(dir, entry.Name())
		if entry.IsDir() {
			if err := printAllTxtFiles(filePath); err != nil {
				return err
			}
		} else if filepath.Ext(filePath) == ".txt" {
			fileBytes, err := os.ReadFile(filePath)
			if err != nil {
				return err
			}
			fmt.Printf("fileName: %v\n%v\n", filePath, string(fileBytes))
		}
	}
	return nil
}

// filePath.WalkDir(dir, func)
func printAllTxtFilesWalkDir(dir string) error {
	return filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
		if !d.IsDir() && filepath.Ext(d.Name()) == ".txt" {
			fileBytes, err := os.ReadFile(path)
			if err != nil {
				return err
			}
			fmt.Printf("filePath: %v\n%v\n", path, string(fileBytes))
		}
		return nil
	})
}
```

## JSON

### `JSON.Marshal` 序列化

```go
func main() {
	mm := map[string]interface{}{
		"Name": "yym",
		"Age":  14,
		"Extra": map[string]any{
			"phone": "2121",
		},
	}

  // 序列化 map 类型
	s, err := json.Marshal(mm) // return []byte error
	if err != nil {
		log.Print(err)
	}
	fmt.Println(string(s)) // {"Age":14,"Extra":{"phone":"2121"},"Name":"yym"}
}

// 切片
mm := []int{1, 2, 3, 4, 5}
s, err := json.Marshal(mm)
fmt.Println(string(s)) // [1,2,3,4,5]

mm := []interface{}{1, "yym", true, map[string]any{"age": 12}, 5}
s, err := json.Marshal(mm) // return []byte error
fmt.Println(string(s)) // [1,"yym",true,{"age":12},5]

// string
mm := "yym"
s, err := json.Marshal(mm)
fmt.Println(string(s)) // "yym"

// int
mm := 12
s, err := json.Marshal(mm)
fmt.Println(string(s)) // 12
```

```go
// 序列化 结构体
type Extra struct{}

type Person struct {
	Name  string `json:"name"`
	Age   int
	Email string
	Phone string `json:"ph,omitempty"` // 空值忽略
	phone string // 没有被导出的字段不会被序列化
	Extra *Extra
}

func main() {
	p := Person{
		Name:  "yym",
		Age:   18,
		Email: "aaa@qq.com",
		Phone: "1565878445",
		phone: "11",
		Extra: &Extra{},
	}

	s, err := json.Marshal(p) // return []byte error
	if err != nil {
		log.Print(err)
	}
	fmt.Println(string(s)) // {"name":"yym","Age":18,"Email":"aaa@qq.com","ph":"1565878445","Extra":{}}
}
```

- tag 控制序列化类型是否序列化

```go
type Person struct {
	Name   string `json:"name"`
	Age    int    `json:"age,string"` // 序列化成一个字符串
	Email  string
	Secret string `json:"-"`            // - 忽略序列化
	Phone  string `json:"ph,omitempty"` // 空值忽略
	phone  string // 没有被导出的字段不会被序列化
	Extra  *Extra
}
```

### `JSON.Unmarshal` 反序列化

```go
type Person struct {
	Name  string `json:"name"`
	Age   int    `json:"age,string"`   // 序列化成一个字符串
	Phone string `json:"ph,omitempty"` // 空值忽略
}

func main() {
	jsonString := `{
		"name": "yym",
		"age": "1212121",
		"ph": "1234"
	}`
	p := Person{}

	err := json.Unmarshal([]byte(jsonString), &p)
	if err != nil {
		log.Print(err)
	}
	fmt.Println(p) // {yym 1212121 1234}
}
```

### `Encoder` Writer

```go
type Person struct {
	Name  string `json:"name"`
	Age   int    `json:"age,string"`   // 序列化成一个字符串
	Phone string `json:"ph,omitempty"` // 空值忽略
}

func main() {
	p := Person{
		Name: "xia&&o<<<>>>ming",
		Age:  54325123412235413,
	}

	//bytes, err := json.MarshalIndent(p, "", "    ")
	//if err != nil {   // panic(err)   //}
	file, err := os.Create("person.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "    ")
	encoder.SetEscapeHTML(true)
	err = encoder.Encode(p)
	if err != nil {
		panic(err)
	}
}
```

### `Decoder` Reader

```go
type Person struct {
	Name  string `json:"name"`
	Age   int    `json:"age,string"`   // 序列化成一个字符串
	Phone string `json:"ph,omitempty"` // 空值忽略
}

func main() {
	file, err := os.Open("person.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	decoder := json.NewDecoder(file)

	p := Person{}
	err = decoder.Decode(&p)
	if err != nil {
		panic(err)
	}
	fmt.Println(p) // {xia&&o<<<>>>ming 54325123412235413 }
}

```

### 常用第三方库

- `tidwall/gjson`
- `tidwall/sjson`

## go 内置 testing 单测

- 文件创建 `name_test.go`

```go
// add.go
func Add(a, b int) int {
	return a + b
}

// add_test.go
import "testing"

func TestAdd(t *testing.T) {
	sum := Add(10, 20)
	if sum != 30 {
		t.Fatal("10 + 20 should be 30")
	}
}

// 命令行运行, 或者编辑器运行
go test path
go test -v .
```

- 安装 `github.com/stretchr/testify/assert`

```go
// add.go
func Add(a, b int) (int error) {
	return a + b, fmt.Errorf("error")
}

// add_test.go
func TestAdd(t *testing.T) {
	sum := Add(10, 20)

	// assert.Equal(t, 期望的值, 实际的值, 信息提示)
	assert.Equal(t, 30, sum, "10 + 20 should be 30")
	assert.Nil(t, err, "Add err is not nil")
}
```

### 子测试

- `t.Run()`

```go
func TestAdd(t *testing.T) {
	sum := Add(10, 20)

	t.Run("10 + 20", func(t *testing.T) {
		assert.Equal(t, 30, sum, "10 + 20 should be 30")
		assert.Nil(t, err, "Add err is not nil")
	})

	t.Run("100 + 200", func(t *testing.T) {
		assert.Equal(t, 300, sum, "100 + 200 should be 300")
		assert.Nil(t, err, "Add err is not nil")
	})
}
```

### 子测试并行、跳过、嵌套

- `t.Parallel()` 并行
- `t.Skip()` 跳过
- `t.Run()` 可以嵌套

```go
func TestAdd(t *testing.T) {
	tests := []struct {
		name     string
		input    []int
		expected int
	}{
		{"10 + 20", []int{10, 20}, 30},
		{"100 + 200", []int{100, 200}, 300},
		{"-100 + (-200)", []int{-100, -200}, -300},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			// 并行
			t.Parallel()
			// 跳过
			if test.input[0] == 100 && test.input[1] == 200 {
				t.Skip()
			}

			ret, err := Add(test.input[0], test.input[1])
			if err != nil {
				t.Error("add failed")
			}
			if ret != test.expected {
				t.Errorf("Expeted: %v\n", test.expected)
			}
		})
	}
}
```

### testing.M、testing.B 基准测试

- testing.M => testing.Main 所有测试函数的 main 函数, 先进入这里
- testing.B => testing.Benchmark

```go
func TestMain(t *testing.M) {
	// 资源的申请 配置的初始化
	os.Setenv("key", "value")
	t.Run()

	// 资源的释放
}

func TestX(t *testing.T) {
	os.Getenv("key")
}

func BenchmarkAddNormal(b *testing.B) {
	b.Log(os.Getenv("NNN"))
	tests := []struct {
		name     string
		input    []int
		expected int
	}{
		{"10 + 20", []int{10, 20}, 30},
		{"100 + 200", []int{100, 200}, 300},
		{"-100 + (-200)", []int{-100, -200}, -300},
	}

	for _, test := range tests {
		test := test
		b.Run(test.name, func(sb *testing.B) {
			if test.input[0] == 100 && test.input[1] == 200 {
				sb.Skip("Skip " + test.name)
			}
			ret, err := Add(test.input[0], test.input[1])
			if err != nil {
				sb.Error("add failed")
			}
			if ret != test.expected {
				sb.Errorf("Expeted: %v\n", test.expected)
			}
		})
	}
}
```
