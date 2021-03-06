import clsx from "clsx"
import { useState, useEffect, useRef } from "react"
import styles from "./Editor.module.scss"
import logo from "../Image/logo.png"
const Editor = () => {
    const [image, setImage] = useState("")
    const [settingActive, setSettingActive] = useState("")

    // Định nghĩa các bộ lọc mặc định ban đầu
    const optionsDefault = {
        brightness:
        {
            min: 0,
            value: 100,
            valueDefault: 100,
            max: 500,
            unit: "%"
        },
        saturate:
        {
            min: 0,
            value: 100,
            valueDefault: 100,
            max: 500,
            unit: "%"
        },
        opacity:
        {
            min: 0,
            value: 100,
            valueDefault: 100,
            max: 100,
            unit: "%"
        },
        invert:
        {
            min: 0,
            value: 0,
            valueDefault: 0,
            max: 100,
            unit: "%"
        },
        grayscale:
        {
            min: 0,
            value: 0,
            valueDefault: 0,
            max: 100,
            unit: "%"
        },
        blur:
        {
            min: 0,
            value: 0,
            valueDefault: 0,
            max: 20,
            unit: "px"
        },
        "hue-rotate":
        {
            min: 0,
            value: 0,
            valueDefault: 0,
            max: 360,
            unit: "deg"
        }
    }
    const [options, setOptions] = useState(optionsDefault)
    const canvasRef = useRef()
    const imageRef = useRef()
    const context = useRef()
    const imageEditedRef = useRef()
    const limitActiveEvent = useRef(true)
    const listOptionItem = useRef()

    // Xử lý việc thay đổi bức ảnh muốn chỉnh sửa
    const handleChangeImage = (imageData) => {
        image && URL.revokeObjectURL(image)
        const img = imageData[0]
        setImage(URL.createObjectURL(img))
    }

    // Thay đổi giá trị của bộ lọc đang xét
    const setOptionsStyle = (settingActive, value) => {
        setOptions({
            ...options,
            [settingActive]: {
                ...options[settingActive],
                value: value
            }
        })
    }

    // Lấy ra giá trị của tất cả bộ lọc cuối cùng muốn lưu về
    const getOptionsStyle = () => {
        let style = ""
        for (let key in options) {
            style += `${key}(${Math.abs(options[key].value)}${options[key].unit}) `
        }
        return style
    }

    // Lưu ảnh
    const savePhoto = () => {
        const canvas = canvasRef.current
        const img = imageRef.current
        canvas.setAttribute("width", img.naturalWidth)
        canvas.setAttribute("height", img.naturalHeight)
        context.current.filter = getOptionsStyle()
        const imgCanvas = context.current.drawImage(imageRef.current, 0, 0, img.naturalWidth, img.naturalHeight)
        const imageEdited = imageEditedRef.current
        const url = canvas.toDataURL("image/*");
        imageEdited.setAttribute("href", url)
        imageEdited.setAttribute("download", "Edited_Photo")
        imageEdited.click()
    }

    // Bỏ hiệu ứng bộ lọc đang chọn ( Mục đích: Thay đổi lựa chọn bộ lọc )
    const removeActive = (list) => {
        const actived = [...list].find(item => item.className.includes(styles.active))
        actived && actived.classList.remove(styles.active)
    }

    useEffect(() => {
        if (image) {
            if (limitActiveEvent.current) {
                limitActiveEvent.current = false
                listOptionItem.current.forEach(item => {
                    item.addEventListener("click", () => {
                        removeActive(listOptionItem.current)
                        item && item.classList.add(styles.active)
                    })
                })
            }
            setOptions(optionsDefault)
            const canvas = canvasRef.current
            context.current = canvas.getContext('2d')
        }
        return () => {
            listOptionItem.current = document.querySelectorAll(`.${styles.sideBarItem}`)
            removeActive(listOptionItem.current)
            listOptionItem.current[0].classList.add(styles.active)
        }
    }, [image])
    return (
        <div className={styles.editor}>
            <div className={styles.appName}>
                <img
                    className={styles.logo}
                    src={logo}
                    alt="logo photo editor"
                ></img>
            </div>
            <div className={styles.canvasBox}>
                <canvas ref={canvasRef} ></canvas>
                <a
                    ref={imageEditedRef}
                ></a>
            </div>
            {image && (
                <ul className={styles.sideBar}>
                    <li
                        className={clsx(styles.sideBarItem, styles.active)}
                        onClick={() => {
                            setOptions(optionsDefault)
                            setSettingActive("default")
                        }}
                    >
                        <i className={clsx("fas fa-user-cog", styles.icon)}></i>
                        <span className={styles.name}>Mặc định</span>
                    </li>
                    <li
                        className={styles.sideBarItem}
                        onClick={() => {
                            setSettingActive("brightness")
                        }}
                    >
                        <i className={clsx("fas fa-sun", styles.icon)}></i>
                        <span className={styles.name}>Độ sáng</span>
                    </li>
                    <li
                        className={styles.sideBarItem}
                        onClick={() => {
                            setSettingActive("saturate")
                        }}
                    >
                        <i className={clsx("fas fa-adjust", styles.icon)}></i>
                        <span className={styles.name}>Bão hòa</span>
                    </li>
                    <li
                        className={styles.sideBarItem}
                        onClick={() => {
                            setSettingActive("opacity")
                        }}
                    >
                        <i className={clsx("fas fa-magic", styles.icon)}></i>
                        <span className={styles.name}>Trong suốt</span>
                    </li>
                    <li
                        className={styles.sideBarItem}
                        onClick={() => {
                            setSettingActive("invert")
                        }}
                    >
                        <i className={clsx("fas fa-brush", styles.icon)}></i>
                        <span className={styles.name}>Âm bản</span>
                    </li>
                    <li
                        className={styles.sideBarItem}
                        onClick={() => {
                            setSettingActive("grayscale")
                        }}
                    >
                        <i className={clsx("fas fa-fill", styles.icon)}></i>
                        <span className={styles.name}>Độ xám</span>
                    </li>
                    <li
                        className={styles.sideBarItem}
                        onClick={() => {
                            setSettingActive("blur")
                        }}
                    >
                        <i className={clsx("fas fa-border-style", styles.icon)}></i>
                        <span className={styles.name}>Độ mờ</span>
                    </li>
                    <li
                        className={styles.sideBarItem}
                        onClick={() => {
                            setSettingActive("hue-rotate")
                        }}
                    >
                        <i className={clsx("fas fa-paint-roller", styles.icon)}></i>
                        <span className={styles.name}>Chuyển màu</span>
                    </li>
                    <li
                        className={styles.sideBarItem}
                        onClick={() => {
                            setOptions({
                                ...optionsDefault,
                                "brightness": {
                                    ...options.brightness,
                                    value: 112
                                },
                                "saturate": {
                                    ...options.saturate,
                                    value: 168
                                },
                                "grayscale": {
                                    ...options.grayscale,
                                    value: 16
                                }
                            })
                            setSettingActive('random')
                        }}
                    >
                        <i className={clsx("fas fa-random", styles.icon)}></i>
                        <span className={styles.name}>Ngẫu hứng</span>
                    </li>
                    <li
                        className={styles.sideBarItem}
                        onClick={() => {
                            savePhoto()
                        }}
                    >
                        <i className={clsx("fas fa-download", styles.icon)}></i>
                        <span className={styles.name}>Lưu</span>
                    </li>
                </ul>
            )}
            <div className={styles.imageBox}>

                <div className={clsx(styles.imageBoxPhoto, image && styles.autoBorder)}>
                    {
                        image ? (
                            <>
                                <label htmlFor={styles.imageFile}>
                                    <i className={clsx("fa-solid fa-circle-plus", styles.change)}></i>
                                </label>
                                <img
                                    src={image}
                                    className={styles.img}
                                    alt="image"
                                    style={
                                        {
                                            filter: getOptionsStyle()
                                        }
                                    }
                                    ref={imageRef}
                                ></img>
                            </>
                        ) : (
                            <div className={styles.imageInput}>
                                <label
                                    htmlFor={styles.imageFile}
                                    className={styles.imageFileIcon}
                                >
                                    <i className={clsx("fas fa-image", styles.icon)}></i>
                                    <p className={styles.title}>Chọn ảnh</p>
                                </label>
                            </div>
                        )
                    } 
                    <input
                        accept="image/*"
                        id={styles.imageFile}
                        type="file"
                        onChange={e => handleChangeImage(e.target.files)}
                    ></input>

                </div>
                {settingActive && settingActive !== "default" && settingActive !== "random" && (
                    <div className={styles.imageBoxRange}>
                        <div className={styles.range}>
                            <span>{Math.abs(options[settingActive].min)}</span>
                            <input
                                className={styles.input}
                                type="range"
                                min={options[settingActive].min}
                                max={options[settingActive].max}
                                value={settingActive !== "opacity" ? options[settingActive].value : (100 - options[settingActive].value)}
                                onChange={(e) => {
                                    setOptionsStyle(settingActive, settingActive !== "opacity" ? e.target.value : (100 - e.target.value))
                                }}
                            ></input>
                            <span>{settingActive !== "opacity" ? options[settingActive].value : 100 - options[settingActive].value}</span>
                        </div>
                        <span

                            className={styles.btn}
                            onClick={() => {
                                setOptionsStyle(settingActive, optionsDefault[settingActive].valueDefault)
                            }}
                        >Reset</span>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Editor